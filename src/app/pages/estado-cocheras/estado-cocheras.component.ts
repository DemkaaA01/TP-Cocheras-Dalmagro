
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cochera'
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from "../../components/header/header.component";
import { CocherasService } from '../../services/cocheras.service';
import { Estacionamiento } from '../../interfaces/estacionamiento';
import Swal from 'sweetalert2';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import 'boxicons';

@Component({
	selector: 'app-estado-cocheras',
	standalone: true,
	imports: [RouterModule, CommonModule, HeaderComponent],
	templateUrl: './estado-cocheras.component.html',
	styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent implements OnInit {
	esAdmin: boolean = false;
	titulo: string = 'Estado de la cochera';
	header: { nro: string; disponibilidad: string; ingreso: string; acciones: string } = {
		nro: 'Número',
		disponibilidad: 'Disponibilidad',
		ingreso: 'Ingreso',
		acciones: 'Acciones'
	};

	filas:Cochera[]=new  Array();

	siguienteNumero: number = 1;

	cocheras = inject(CocherasService);
	auth = inject(AuthService);
	estacionamientos = inject(EstacionamientosService);

	//agrega fila
	async agregarFila() {
		const { value: nombreCochera } = await Swal.fire({
			title: "Ingrese el nombre de la cochera",
			input: "text",
			inputLabel: "Nombre de cochera",
			inputValue: '',
			showCancelButton: true,
			// inputValidator: (value) => {
			// 	if (!value) {
			// 		return "Debe escribir un nombre para la cochera!";
			// 	}
			// }
		});
	
		if (nombreCochera) {
			fetch('http://localhost:4000/cocheras/', {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + this.auth.getToken(),
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					descripcion: nombreCochera
				})
			}).then(() => {
				this.traerCocheras().then((filas) => {
					this.filas = filas;
				});
			}).catch(error => {
				console.error('Error en la solicitud:', error);
			});
			this.siguienteNumero += 1;
		}
	}




//trae las cocheras del back
	traerCocheras() {
		return fetch('http://localhost:4000/cocheras/', {
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + this.auth.getToken()
			}
		}).then((response) => response.json())
			.then((filas) => {
				this.filas = filas; 
				console.log("Lista de cocheras traída del servidor:", this.filas);
				return filas;
			});
	}


//elimina una fila
async eliminarFila(cocheraId: number) {
	const confirm = await Swal.fire({
	  title: '¿Estás seguro?',
	  text: '¿Deseas eliminar esta cochera?',
	  icon: 'warning',
	  showCancelButton: true,
	  confirmButtonText: 'Sí, eliminar',
	  cancelButtonText: 'Cancelar',
	});
  
	if (confirm.isConfirmed) {
	  fetch(`http://localhost:4000/cocheras/${cocheraId}`, {
		method: 'DELETE',
		headers: {
		  Authorization: 'Bearer ' + this.auth.getToken(),
		},
	  })
		.then(() => {
		  this.traerCocheras().then(filas => {
			this.filas = filas;
		  });
		})
		.catch(error => {
		  console.error('Error en la solicitud:', error);
		});
	}
  }



	
//habilita una cochera para que quede disponible a su uso
	async habilitarCochera(cocheraId: number) {
	const confirm = await Swal.fire({
	  title: '¿Estás seguro?',
	  text: '¿Deseas habilitar esta cochera?',
	  icon: 'warning',
	  showCancelButton: true,
	  confirmButtonText: 'Sí, habilitar',
	  cancelButtonText: 'Cancelar',
	});
  
	if (confirm.isConfirmed) {
	  fetch(`http://localhost:4000/cocheras/${cocheraId}/enable`, {
		method: 'POST',
		headers: {
		  authorization: 'Bearer ' + this.auth.getToken(),
		},
	  })
		.then(response => {
		  if (!response.ok) {
			throw new Error("Error al habilitar la cochera en el servidor");
		  } else {
			this.traerCocheras(); 
		  }
		})
		.catch(error => {
		  console.error('Error en la solicitud:', error);
		});
	}
  }

//deshabilita una cochera para que quede disponible a su uso
async deshabilitarCochera(cocheraId: number) {
	const confirm = await Swal.fire({
	  title: '¿Estás seguro?',
	  text: '¿Deseas deshabilitar esta cochera?',
	  icon: 'warning',
	  showCancelButton: true,
	  confirmButtonText: 'Sí, deshabilitar',
	  cancelButtonText: 'Cancelar',
	});
  
	if (confirm.isConfirmed) {
	  const data = { deshabilitado: true };
	  fetch(`http://localhost:4000/cocheras/${cocheraId}/disable`, {
		method: 'POST',
		headers: {
		  authorization: 'Bearer ' + this.auth.getToken(),
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	  })
		.then(response => {
		  if (!response.ok) {
			throw new Error("Error al deshabilitar la cochera en el servidor");
		  }
		  this.traerCocheras(); 
		})
		.catch(error => {
		  console.error('Error en la solicitud:', error);
		});
	}
  }




	ngOnInit() {
		this.traerCocheras().then((filas) => {
			this.filas = filas;
		});
	}



//Abre un modal para agregar una nueva patente a la fila
async abrirModalNuevoEstacionamiento(idCochera: number) {
	const result = await Swal.fire({
	  title: "Ingrese la patente del vehículo",
	  input: "text",
	  showCancelButton: true,
	  inputValidator: (value) => {
		if (!value) {
		  return "Ingrese una patente válida";
		}
		return null;
	  }
	});
  
	if (result.isConfirmed) {
	  const patente = result.value;
	  const cocheraIndex = this.filas.findIndex(fila => fila.id === idCochera);
	  const horaIngreso = new Date().toLocaleTimeString();
  
	  if (cocheraIndex !== -1) {
		this.filas[cocheraIndex].patente = patente;
		this.filas[cocheraIndex].deshabilitada = false; 
		this.filas[cocheraIndex].horaIngreso = horaIngreso;


		const data = {
		  idCochera: idCochera,
		  patente: patente,
		  horaIngreso: horaIngreso
		};
		console.log(data)
 
		try {
			const response = await fetch('http://localhost:4000/estacionamientos/abrir', {
			  method: 'POST',
			  headers: {
				authorization: 'Bearer ' + this.auth.getToken(),
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify(data)
			});
			
			if (!response.ok) {
			  const errorData = await response.json();
			  console.error("Error del servidor:", errorData);
			}
		  } catch (error) {
			console.error("Error en la solicitud:", error);
		  }
	  }}
	}
		  

	
//cuando se toca arriba de la patente existente abre un modal para cerrar el estacionamiento y hace el cobro
async cerrarEstacionamiento(patente: string) {
	const result = await Swal.fire({
		title: "¿Desea cerrar el estacionamiento?",
		text: "Esta acción liberará la cochera y la marcará como disponible.",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Sí, cerrar",
		cancelButtonText: "Cancelar"
	});

	if (result.isConfirmed) {
		try {
			const response = await fetch(`http://localhost:4000/estacionamientos/cerrar`, {
				method: 'PATCH',
				headers: {
					Authorization: 'Bearer ' + this.auth.getToken(),
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ patente: patente }),
			});

			if (!response.ok) {
				throw new Error("Error al cerrar la cochera en el servidor");
			}

			const data = await response.json();
			await Swal.fire({
				title: "Cierre de estacionamiento exitoso",
				text: `Se cobró un total de $${data.costo}.`,
				icon: "success",
				confirmButtonText: "Aceptar"
			});

			this.traerCocheras();

		} catch (error) {
			console.error('Error en la solicitud:', error);
			await Swal.fire({
				title: "Error",
				text: "Ocurrió un error al cerrar la cochera.",
				icon: "error",
				confirmButtonText: "Aceptar"
			});
		}
	}
}
}