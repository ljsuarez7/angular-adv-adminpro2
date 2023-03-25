import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy{

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription = new Subscription();

  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private usuarioService: UsuarioService, private busquedasService: BusquedasService, private modalImagenService: ModalImagenService){}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarUsuarios();

    //Añadimos el delay para que de tiempo a que se haga el cambio y se refleja en la web al recargar
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(delay(100)).subscribe(img => this.cargarUsuarios());

  }

  cargarUsuarios(){

    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });

  }

  cambiarPagina(valor: number){
    
    this.desde += valor;

    if(this.desde < 0){

      this.desde = 0;

    }else if(this.desde >= this.totalUsuarios){

      this.desde -= valor; 

    }

    this.cargarUsuarios();

  }

  buscar(termino: string){

    if(termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar('usuarios', termino)
      .subscribe( (resp: Usuario[]) => {
        this.usuarios = resp;
      });

      return '';

  }

  eliminarUsuario(usuario: Usuario){

    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error', 'No se puede borrar a si mismo', 'error');
    }
    
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe( resp => {

            this.cargarUsuarios();
            Swal.fire('Usuario borrado', `${usuario.nombre} fue eliminado correctamente`, 'success');

            return;

          });

      }
    });

    return '';
    
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
    .subscribe(resp => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
  }

}


