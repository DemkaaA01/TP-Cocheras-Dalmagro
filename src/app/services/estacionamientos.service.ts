import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';

@Injectable({
	providedIn: 'root'
})
export class EstacionamientosService {
	buscarActivo(id: any) {
		throw new Error('Method not implemented.');
	}

	auth = inject(AuthService)

	estacionamientos(): Promise<Estacionamiento[]> {
		return fetch('http://localhost:4000/cocheras', {
			method: 'GET',
			headers: {
				authorization: "Bearer " + (this.auth.getToken() ?? ''),
			},
		}).then(r => r.json());
	}

	buscarEstacionamientoActivo(cocheraId: number) {
		return this.estacionamientos().then(estacionamientos => {
			let buscado = null;
			for (let estacionamiento of estacionamientos) {
				if (estacionamiento.idCochera === cocheraId &&
					estacionamiento.horaEgreso === null) {
					buscado = estacionamiento;
				}
			}
			return buscado;
		});
	}

	async estacionarAuto(patenteAuto: string, cocheraId: number) {
		const r = await fetch('http://localhost:4000/estacionamientos/abrir', {
			method: 'POST',
			headers: {
				authorization: "Bearer " + (this.auth.getToken() ?? ''),
				"content-type": "application/json"
			},
			body: JSON.stringify({
				patente: patenteAuto,
				cocheraId: cocheraId,
				idUsuarioIngreso: "admin"
			})
		});
		return await r.json();
	}
}
