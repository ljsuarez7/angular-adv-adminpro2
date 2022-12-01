import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit{

  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`
  }

  //Sin renombrar atributo:
  // @Input() progreso: number = 40;
  @Input('valor') progreso: number = 40;
  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();

  @Input() btnClass: string = 'btn-primary';

  cambiarValor(valor: number){

    if(this.progreso >= 100 && valor >=0){
      this.valorSalida.emit(100);
      this.progreso = 100;
    }else if(this.progreso <= 0 && valor <0){
      this.valorSalida.emit(0);
      this.progreso = 0;
    }else{
      this.valorSalida.emit(this.progreso + valor);
      this.progreso = this.progreso + valor;
    }

  }

  onChange(nuevoValor: number){
    
    if(nuevoValor >= 100){
      this.progreso = 100;
    }else if(nuevoValor <= 0){
      this.progreso = 0;
    }else{
      this.progreso = nuevoValor;
    }

    this.valorSalida.emit(this.progreso);
    
  }

}
