import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercaseNoNumbers]'
})
export class UppercaseNoNumbersDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;
    // Substitui caracteres não alfabéticos e transforma tudo em uppercase
    input.value = input.value.replace(/[^A-Za-z]/g, '').toUpperCase();
  }
}
