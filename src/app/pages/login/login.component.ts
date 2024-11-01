import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from '../../interfaces/login';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    datosLogin: Login = {
        username: '',
        password: ''

    };
    router = inject(Router);
    auth = inject(AuthService)
password: any;

//Te loguea y da acceso a estado cocheras
Login() {
        this.auth.Login(this.datosLogin)
            .then(ok => {
                if (ok)
                    this.router.navigate(['/estado-cocheras']);
                else
                    Swal.fire({
                        icon: "error",
                        title: "Error de Incio de Sesión",
                        text: "¡Contraseña o usuario incorrectos!",
                    });
            }

            )

    };

abrirModalRegistro(){
    Swal.fire({
        icon: "error",
        title: "Lo siento, esta opción esta caida",
        text: "Estamos trabajando en ello 🛠️!",
      });
}

    async abrirModalContrasena(){
        const { value: email } = await Swal.fire({
            title: "Ingrese su mail para poder recuperar su contraseña",
            input: "email",
            inputPlaceholder: "example@gmail.com",
          });
        
          if (email) {
            const { value: numero } = await Swal.fire({
              title: "Elija un numero de verificación",
              input: "select",
              inputOptions: {
                96: "96",
                15: "15",
                34: "34"
              },
              inputPlaceholder: "Elija un numero",
              showCancelButton: true,
            //   inputValidator: (value) => {
            //     if (!value) {
            //       return "You need to select a number!";
            //     }
            //   }
            });
        
            if (numero === "96") {
              const { value: formValues } = await Swal.fire({
                title: "Escriba su nueva contraseña",
                html: `
                  <input id="swal-input1" class="swal2-input" placeholder="......">
                  <input id="swal-input2" class="swal2-input" placeholder="......">
                `,
                focusConfirm: false,
                preConfirm: () => {
                  const input1 = (document.getElementById("swal-input1") as HTMLInputElement).value;
                  const input2 = (document.getElementById("swal-input2") as HTMLInputElement).value;
                  return [input1, input2];
                }
              });
        
              if (formValues) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Contraseña cambiada con exito!",
                    showConfirmButton: false,
                    timer: 1500
                  });
              }
            } else {
              Swal.fire({
                icon: "error",
                title: "Número incorrecto",
              });
            }
          }
      
      }

    }





