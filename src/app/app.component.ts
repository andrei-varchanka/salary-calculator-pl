import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  form: FormGroup;

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  headers = ['Month', 'Brutto', 'Ub. emerytalne', 'Ub. rentowe', 'Ub. chorobowe', 'Podstawa wymiaru składki na ub. zdrowotne', 'Ub. zdrowotne', 'Koszty autorskie', 'Koszty pracownik mejscowy', 'Podstawa opodat.', 'Zaliczka na PIT', 'Netto amount'];

  bruttoMonthlySalaries: number[] = [];

  bruttoSalaryTotal = 0;

  ubezpieczenieEmerytalne: number[] = [];

  UB_EMER_RATE = 0.0976;

  ubezpieczenieEmerytalneTotal = 0;

  ubezpieczenieRentowe: number[] = [];

  UB_RENT_RATE = 0.015;

  ubezpieczenieRentoweTotal = 0;

  ubezpieczenieChorobowe: number[] = [];

  UB_CHOR_RATE = 0.0245;

  ubezpieczenieChoroboweTotal = 0;

  ubezpieczenieZdrowotne: number[] = [];

  UB_ZDR_RATE = 0.09;

  ubezpieczenieZdrowotneTotal = 0;

  UB_EMER_RENT_LIMIT = 177660;

  baseAmounts: number[] = [];

  baseAmountsTotal = 0;

  podstawaOpodatkowania: number[] = [];

  podstawaOpodatkowaniaTotal = 0;

  PIT_LIMIT = 120000;

  KOSZTY_AUTORSKIE_LIMIT = 120000;

  KOSZT_PRAC_MEJSC = 250;

  creativeWorkPercent = 0.8;

  kosztyAutorskie: number[] = [];

  kosztyAutorskieTotal = 0;

  ULGA = 300;

  zaliczkaPit: number[] = [];

  PIT_RATE_LOWER = 0.12;

  PIT_RATE_HIGHER = 0.32;

  zaliczkaPitTotal = 0;

  nettoMonthlySalaries: number[] = [];

  nettoTotal = 0;

  nettoPercent = 0;

  nettoPercents: any[] = [];
  nettoSalaries: any[] = [];
  view: any[] = [600, 300];
  colorScheme = { domain: ['#5AA454'] };

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      bruttoMonthlySalary: [18205],
      kosztyAutorskieIncluded: [false]
    });
    this.form.get('kosztyAutorskieIncluded').valueChanges.subscribe(value => {
      this.calculateRange();
      this.calculate();
    });
  }

  ngOnInit() {
    this.calculateRange();
    this.calculate();
  }

  init() {
    this.bruttoMonthlySalaries = new Array(this.months.length);
    this.bruttoSalaryTotal = 0;
    this.ubezpieczenieEmerytalne = new Array(this.months.length);
    this.ubezpieczenieEmerytalneTotal = 0;
    this.ubezpieczenieRentowe = new Array(this.months.length);
    this.ubezpieczenieRentoweTotal = 0;
    this.ubezpieczenieChorobowe = new Array(this.months.length);
    this.ubezpieczenieChoroboweTotal = 0;
    this.ubezpieczenieZdrowotne = new Array(this.months.length);
    this.ubezpieczenieZdrowotneTotal = 0;
    this.baseAmounts = new Array(this.months.length);
    this.baseAmountsTotal = 0;
    this.podstawaOpodatkowania = new Array(this.months.length);
    this.podstawaOpodatkowaniaTotal = 0;
    this.kosztyAutorskie = new Array(this.months.length);
    this.kosztyAutorskieTotal = 0;
    this.zaliczkaPit = new Array(this.months.length);
    this.zaliczkaPitTotal = 0;
    this.nettoMonthlySalaries = new Array(this.months.length);
    this.nettoTotal = 0;
    this.nettoPercent = 0;
  }

  calculate(bruttoSalaryParam?: number) {
    let bruttoSalary = bruttoSalaryParam || +this.form.get('bruttoMonthlySalary')?.value;
    this.init();
    for (let i = 0; i < this.months.length; i++) {
      this.bruttoMonthlySalaries[i] = bruttoSalary;
      this.bruttoSalaryTotal += this.bruttoMonthlySalaries[i];
      if (this.bruttoSalaryTotal <= this.UB_EMER_RENT_LIMIT) {
        this.ubezpieczenieEmerytalne[i] = this.bruttoMonthlySalaries[i] * this.UB_EMER_RATE;
        this.ubezpieczenieRentowe[i] = this.bruttoMonthlySalaries[i] * this.UB_RENT_RATE;
      } else {
        let bruttoRest = this.UB_EMER_RENT_LIMIT - (this.bruttoSalaryTotal - this.bruttoMonthlySalaries[i]);
        this.ubezpieczenieEmerytalne[i] = Math.max(bruttoRest, 0) * this.UB_EMER_RATE;
        this.ubezpieczenieRentowe[i] = Math.max(bruttoRest, 0) * this.UB_RENT_RATE;
      }
      this.ubezpieczenieEmerytalneTotal += this.ubezpieczenieEmerytalne[i];
      this.ubezpieczenieRentoweTotal += this.ubezpieczenieEmerytalne[i];
      this.ubezpieczenieChorobowe[i] = this.bruttoMonthlySalaries[i] * this.UB_CHOR_RATE;
      this.ubezpieczenieChoroboweTotal += this.ubezpieczenieChorobowe[i];
      this.baseAmounts[i] = this.bruttoMonthlySalaries[i] - this.ubezpieczenieEmerytalne[i] - this.ubezpieczenieRentowe[i] - this.ubezpieczenieChorobowe[i];
      this.baseAmountsTotal += this.baseAmounts[i];
      this.ubezpieczenieZdrowotne[i] = this.baseAmounts[i] * this.UB_ZDR_RATE;
      this.ubezpieczenieZdrowotneTotal += this.ubezpieczenieZdrowotne[i];
      if (this.form.get('kosztyAutorskieIncluded')?.value) {
        const kosztyAutorskie = this.baseAmounts[i] * this.creativeWorkPercent * 0.5;
        if (this.kosztyAutorskieTotal + kosztyAutorskie <= this.KOSZTY_AUTORSKIE_LIMIT) {
          this.kosztyAutorskie[i] = kosztyAutorskie;
        } else {
          let kosztyAutorskieRest = this.KOSZTY_AUTORSKIE_LIMIT - this.kosztyAutorskieTotal;
          this.kosztyAutorskie[i] = Math.max(kosztyAutorskieRest, 0) * this.creativeWorkPercent * 0.5;
        }
      } else {
        this.kosztyAutorskie[i] = 0;
      }
      this.kosztyAutorskieTotal += this.kosztyAutorskie[i];
      this.podstawaOpodatkowania[i] = Math.round(this.baseAmounts[i] - this.KOSZT_PRAC_MEJSC - this.kosztyAutorskie[i]);
      this.podstawaOpodatkowaniaTotal += this.podstawaOpodatkowania[i];
      if (this.podstawaOpodatkowaniaTotal <= this.PIT_LIMIT) {
        this.zaliczkaPit[i] = Math.round(this.podstawaOpodatkowania[i] * this.PIT_RATE_LOWER - this.ULGA);
      } else {
        let podstawaOpodatkowaniaLowerRateAmount = Math.max(this.PIT_LIMIT - (this.podstawaOpodatkowaniaTotal - this.podstawaOpodatkowania[i]), 0);
        let podstawaOpodatkowaniaHigherRateAmount = this.podstawaOpodatkowania[i] - podstawaOpodatkowaniaLowerRateAmount;
        this.zaliczkaPit[i] = Math.round(podstawaOpodatkowaniaLowerRateAmount * this.PIT_RATE_LOWER + podstawaOpodatkowaniaHigherRateAmount * this.PIT_RATE_HIGHER - this.ULGA);
      }
      this.zaliczkaPitTotal += this.zaliczkaPit[i];
      this.nettoMonthlySalaries[i] = this.baseAmounts[i] - this.ubezpieczenieZdrowotne[i] - this.zaliczkaPit[i];
      this.nettoTotal += this.nettoMonthlySalaries[i];
    }
    this.nettoPercent = this.nettoTotal / this.bruttoSalaryTotal * 100;
  } 

  calculateRange() {
    this.nettoSalaries = [];
    this.nettoPercents = [];
    for (let i = 5000; i <= 35000;) {
      this.calculate(i);
      this.nettoSalaries.push({name: i, value: this.nettoTotal.toFixed(2)});
      this.nettoPercents.push({name: i, value: this.nettoPercent.toFixed(2)});
      i+=1000;
    }
  }
}
