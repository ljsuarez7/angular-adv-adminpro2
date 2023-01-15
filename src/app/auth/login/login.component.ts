import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;

  public loginForm: FormGroup = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService){

  }

  ngAfterViewInit(): void {

    this.googleInit();

  }

  googleInit(){

    google.accounts.id.initialize({
      client_id: "866742657113-grggtd4jtaes0f2s4qkmdrlkkjb4p1dq.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );

  }

  handleCredentialResponse(response: any){

    // console.log("Encoded JWT ID token " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(
        {
          next: resp => {

            //Navegar al Dashboard
            this.router.navigateByUrl('/');
            
          },
          error: (err) => {
            //Si sucede error
            Swal.fire('Error', err.error.msg, 'error');
          }
        }
      );

  }

  login(){

    this.usuarioService.login(this.loginForm.value)
    .subscribe(
      {
        next: resp => {
          if(this.loginForm.get('remember')!.value){
            localStorage.setItem('email', this.loginForm.get('email')!.value);
          }else{
            localStorage.removeItem('email');
          }

          //Navegar al Dashboard
          this.router.navigateByUrl('/');

        },
        error: (err) => {
          //Si sucede error
          Swal.fire('Error', err.error.msg, 'error');
        }
      }
    );
    
  }

}
