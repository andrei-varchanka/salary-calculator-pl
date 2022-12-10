import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  headers = ['Month', 'Brutto', 'Ub. emerytalne', 'Ub. rentowe', 'Ub. chorobowe', 'Ub. zdrowotne', 'Podstawa opodat.', 'Zaliczka na PIT', 'Netto'];

  bruttoMonthlySalary = 18205;

  bruttoMonthlySalaries: number[] = new Array(this.months.length);

  bruttoSalaryTotal = 0;

  ubezpieczenieEmerytalne: number[] = new Array(this.months.length);

  ubezpieczenieEmerytalneRate = 0.0976;

  ubezpieczenieEmerytalneTotal = 0;

  ubezpieczenieRentowe: number[] = new Array(this.months.length);

  ubezpieczenieRentoweRate = 0.015;

  ubezpieczenieRentoweTotal = 0;

  ubezpieczenieChorobowe: number[] = new Array(this.months.length);

  ubezpieczenieChoroboweRate = 0.0245;

  ubezpieczenieChoroboweTotal = 0;

  ubezpieczenieZdrowotne: number[] = new Array(this.months.length);

  ubezpieczenieZdrowotneRate = 0.09;

  ubezpieczenieZdrowotneTotal = 0;

  bruttoAnnualLimitForUbezpieczenieEmerytalneRentowe = 177660;

  baseAmounts: number[] = new Array(this.months.length);

  podstawaOpodatkowania: number[] = new Array(this.months.length);

  podstawaOpodatkowaniaTotal = 0;

  podstawaOpodatkowaniaAnnualLimit = 120000;

  kosztyDefault = 250;

  kosztyAuthorskie = this.bruttoMonthlySalary * 0.8 * 0.5;

  ulga = 300;

  zaliczkaPit: number[] = new Array(this.months.length);

  pitRate1 = 0.12;

  pitRate2 = 0.32;

  zaliczkaPitTotal = 0;

  nettoMonthlySalaries: number[] = new Array(this.months.length);

  nettoTotal = 0;

  ngOnInit() {
    this.calculate();
  }

  calculate() {
    for (let i = 0; i < this.months.length; i++) {
      this.bruttoMonthlySalaries[i] = this.bruttoMonthlySalary;
      this.bruttoSalaryTotal += this.bruttoMonthlySalaries[i];
      if (this.bruttoSalaryTotal <= this.bruttoAnnualLimitForUbezpieczenieEmerytalneRentowe) {
        this.ubezpieczenieEmerytalne[i] = this.bruttoMonthlySalaries[i] * this.ubezpieczenieEmerytalneRate;
        this.ubezpieczenieRentowe[i] = this.bruttoMonthlySalaries[i] * this.ubezpieczenieRentoweRate;
      } else {
        let bruttoRest = this.bruttoAnnualLimitForUbezpieczenieEmerytalneRentowe - (this.bruttoSalaryTotal - this.bruttoMonthlySalaries[i]);
        this.ubezpieczenieEmerytalne[i] = Math.max(bruttoRest, 0) * this.ubezpieczenieEmerytalneRate;
        this.ubezpieczenieRentowe[i] = Math.max(bruttoRest, 0) * this.ubezpieczenieRentoweRate;
      }
      this.ubezpieczenieEmerytalneTotal += this.ubezpieczenieEmerytalne[i];
      this.ubezpieczenieRentoweTotal += this.ubezpieczenieEmerytalne[i];
      this.ubezpieczenieChorobowe[i] = this.bruttoMonthlySalaries[i] * this.ubezpieczenieChoroboweRate;
      this.ubezpieczenieChoroboweTotal += this.ubezpieczenieChorobowe[i];
      this.baseAmounts[i] = this.bruttoMonthlySalaries[i] - this.ubezpieczenieEmerytalne[i] - this.ubezpieczenieRentowe[i] - this.ubezpieczenieChorobowe[i];
      this.ubezpieczenieZdrowotne[i] = this.baseAmounts[i] * this.ubezpieczenieZdrowotneRate;
      this.podstawaOpodatkowania[i] = Math.round(this.baseAmounts[i] - this.kosztyDefault - this.kosztyAuthorskie);
      this.podstawaOpodatkowaniaTotal += this.podstawaOpodatkowania[i];
      if (this.podstawaOpodatkowaniaTotal <= this.podstawaOpodatkowaniaAnnualLimit) {
        this.zaliczkaPit[i] = Math.round(this.podstawaOpodatkowania[i] * this.pitRate1 - this.ulga);
      } else {
        let podstawaOpodatkowaniaLowerRateAmount = Math.max(this.podstawaOpodatkowaniaAnnualLimit - (this.podstawaOpodatkowaniaTotal - this.podstawaOpodatkowania[i]), 0);
        let podstawaOpodatkowaniaHigherRateAmount = this.podstawaOpodatkowania[i] - podstawaOpodatkowaniaLowerRateAmount;
        this.zaliczkaPit[i] = Math.round(podstawaOpodatkowaniaLowerRateAmount * this.pitRate1 + podstawaOpodatkowaniaHigherRateAmount * this.pitRate2 - this.ulga);
      }
      this.zaliczkaPitTotal += this.zaliczkaPit[i];
      this.nettoMonthlySalaries[i] = this.baseAmounts[i] - this.ubezpieczenieZdrowotne[i] - this.zaliczkaPit[i];
      this.nettoTotal += this.nettoMonthlySalaries[i];
    }
  } 
}
