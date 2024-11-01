import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
esAdmin: boolean = true
auth = inject(AuthService)

abrirModal(){
  Swal.fire({
    title: "Enter your IP address",
    input: "text",
    inputLabel: "Your IP address",
    inputValue: "",
    showCancelButton: true,
}).then((result)=>{
  console.log(result);
})
}

resultadoInput:string = "";

abrirModalMiCuenta(){
  Swal.fire({
    title: "Usuario: Admin",
    text: "Hola Admin! Gracias por usar EASYPARK.",
    imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAgxJREFUSEvFloFNAzEMRdNJgEmATWASYBLoJMAksAn0ifunX/fnLj0JNVJVKef429/fiXftQmt3Idy2Bfi6tXbXWuP/ewqc/49zkhgFBuShtfa04FzgLxZQ13wE+HkFsDongP1hk3ObgMnydaJVDqDz80Dz25QVNiyov51YkS0B3Pey72WMwy8LF8DHAQo5RzkoC6sL3gN+t0ypWaVNjgEiKBdW1QPgN5XzBAy9clxBE/34TIy4NigNjM2rAjvFOKNGvn5WVO019SDJGuCZmQrs2eLEKfQMYIIsWN5miSFp5SjrCowRkZ5Qc1Ct6p5qpoATS/GcA9MSGLGgRRmJXQWVxOZM1WRghO+smUU3cgNUqOuwAic2FFRiw3UzJ9QDTmpPNQao7tfWc+CZLQdwByljMldmSdyxXydDdUPM2GtcFS0gbLiZ+PeFqMgmvVBewggcKen0LcD89CJVPfixyKRT7Q2f2gJnAuRB8AWwHo8aa1R8FZFH53T3rsoKUh8FL9/iBeJ0Syz1pWK/Uus1d3AX45Fg19qGKDXqkF26PNivL5JEpoBOziXgpReoPhpL9dS34WdRGXB9asLoXaMV2GvKt25vL81cgFZwHGmYg04FRq9ehdHnZABQpGvD3sh0mVq9p4XZdg1YhiMBaLrUINi5e/62R4E9AF0k0oLa618G+sXot3w8N+MtGPHML602mh+PBzzCAAAAAElFTkSuQmCC",
    imageWidth: 100,
    imageHeight: 100,
    imageAlt: "Custom image"
  });
}



}
