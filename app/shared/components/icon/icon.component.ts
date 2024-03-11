import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SVG_ICONS as svgIcons } from './svg-icons.generated';

@Component({
  standalone: true,
  selector: 'app-icon',
  template: '',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnChanges {
  @Input({ required: true }) public icon: string | undefined;

  public constructor(private readonly elementRef: ElementRef) {}
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon'] && this.icon) {
      this.setIcon(this.icon);
    }
  }

  private setIcon(iconToSet: string): void {
    const svgIcon = svgIcons.find(
      (icon: { name: string; width: number; height: number; svg: string }) => icon.name === iconToSet,
    );

    if (svgIcon) {
      this.elementRef.nativeElement.style.setProperty('--icon-width', `${svgIcon.width}px`);

      this.elementRef.nativeElement.style.setProperty('--icon-height', `${svgIcon.height}px`);

      (this.elementRef.nativeElement as HTMLElement).innerHTML = svgIcon.svg;
    } else {
      throw Error(`Icon ${this.icon} not found`);
    }
  }
}
