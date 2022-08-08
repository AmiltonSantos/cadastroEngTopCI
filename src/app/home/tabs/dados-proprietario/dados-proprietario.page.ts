import { Proprietario } from './../../models/Proprietario';
import { Component, OnInit } from '@angular/core';
import { FormGroup  } from '@angular/forms';

@Component({
    selector: 'app-dados-proprietario',
    templateUrl: './dados-proprietario.page.html',
    styleUrls: ['./dados-proprietario.page.scss'],
})
export class DadosProprietarioPage implements OnInit {
    formCadastro: FormGroup;
    proprietario: Proprietario = new Proprietario();

    constructor() { }

    ngOnInit() {
    }

    async salvarCadastro() {
        if (this.formCadastro.valid) {
            this.proprietario.proprietario = this.formCadastro.value.proprietario;
            this.proprietario.cpf = this.formCadastro.value.cpf;
            this.proprietario.rg = this.formCadastro.value.rg;
            this.proprietario.tipo1 = this.formCadastro.value.tipo1;
            this.proprietario.logradouro1 = this.formCadastro.value.logradouro1;
            this.proprietario.numero1 = this.formCadastro.value.numero1;
            this.proprietario.bairro1 = this.formCadastro.value.bairro1;
            this.proprietario.cep1 = this.formCadastro.value.cep1;
            this.proprietario.complemento1 = this.formCadastro.value.complemento1;
            //await this.storageService.set(this.usuario.email, this.usuario);
            //this.route.navigateByUrl('/home')
        } else {
            alert('Formulário Inválido');
        }
    }

}
