import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy{

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription = new Subscription();

  constructor(private medicoService: MedicoService, private modalImagenService:  ModalImagenService, private busquedasService: BusquedasService){

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(delay(100)).subscribe(img => this.cargarMedicos());

  }

  buscar(termino: string){

    if(termino.length === 0){
      return this.cargarMedicos();
    }

    this.busquedasService.buscar('medicos', termino)
      .subscribe( resp => {        
        this.medicos = resp;
      });

      return;

  }

  cargarMedicos(){
    
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        this.cargando = false;
        this.medicos = medicos;
        console.log(medicos);
      });

  }

  abrirModal(medico: Medico){

    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);

  }

  borrarMedico(medico: Medico){
    
    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.medicoService.borrarMedico(medico._id)
          .subscribe( resp => {

            this.cargarMedicos();
            Swal.fire('Medico borrado', `${medico.nombre} fue eliminado correctamente`, 'success');

            return;

          });

      }
    });

    return '';

  }

}
