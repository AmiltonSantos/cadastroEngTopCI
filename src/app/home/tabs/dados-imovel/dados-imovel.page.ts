import { Imovel } from './../../models/Imovel';
import { Component, OnInit } from '@angular/core';
import { FormGroup  } from '@angular/forms';

@Component({
    selector: 'app-dados-imovel',
    templateUrl: './dados-imovel.page.html',
    styleUrls: ['./dados-imovel.page.scss'],
})
export class DadosImovelPage implements OnInit {
    formCadastro: FormGroup;
    imovel: Imovel = new Imovel();

    constructor() { }

    ngOnInit() {
    }

    async salvarCadastro() {
        if (this.formCadastro.valid) {
            this.imovel.ocupacao = this.formCadastro.value.ocupacao;
            this.imovel.situacao = this.formCadastro.value.situacao;
            this.imovel.podologia = this.formCadastro.value.podologia;
            this.imovel.topografia = this.formCadastro.value.topografia;
            this.imovel.limitacao = this.formCadastro.value.limitacao;
            this.imovel.patrimonio = this.formCadastro.value.patrimonio;
            this.imovel.isentotsu = this.formCadastro.value.isentotsu;
            this.imovel.isentoiptu = this.formCadastro.value.isentoiptu;
            this.imovel.usodoimovel = this.formCadastro.value.usodoimovel;
            this.imovel.aquisicao = this.formCadastro.value.aquisicao;

            this.imovel.tipoedificacao = this.formCadastro.value.tipoedificacao;
            this.imovel.usoedificacao = this.formCadastro.value.usoedificacao;
            this.imovel.calcada = this.formCadastro.value.calcada;
            this.imovel.situacaolote = this.formCadastro.value.situacaolote;
            this.imovel.situacaoconstruida = this.formCadastro.value.situacaoconstruida;
            this.imovel.estrutura = this.formCadastro.value.estrutura;
            this.imovel.padraoconstrutiva = this.formCadastro.value.padraoconstrutiva;
            this.imovel.revestimentointerno = this.formCadastro.value.revestimentointerno;
            this.imovel.conservacao = this.formCadastro.value.conservacao;
            this.imovel.forro = this.formCadastro.value.forro;
            this.imovel.isntalsanitaria = this.formCadastro.value.isntalsanitaria;
            this.imovel.instaleletrica = this.formCadastro.value.instaleletrica;

            this.imovel.agua = this.formCadastro.value.agua;
            this.imovel.piso = this.formCadastro.value.piso;
            this.imovel.cobertura = this.formCadastro.value.cobertura;
            this.imovel.pintura = this.formCadastro.value.pintura;
            this.imovel.esgoto = this.formCadastro.value.esgoto;
            this.imovel.energia = this.formCadastro.value.energia;
            this.imovel.iluminacao = this.formCadastro.value.iluminacao;
            this.imovel.telefone = this.formCadastro.value.telefone;


            //await this.storageService.set(this.usuario.email, this.usuario);
            //this.route.navigateByUrl('/home')
        } else {
            alert('Formulário Inválido');
        }
    }

}
