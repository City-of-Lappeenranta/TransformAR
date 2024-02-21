import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { SVG_ICONS as svgIcons } from './svg-icons.generated';

@Component({
  standalone: true,
  selector: 'app-icon',
  template: '',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input({ required: true }) public icon: string | undefined;

  public constructor(private readonly elementRef: ElementRef) {}

  public ngOnInit(): void {
    const svgIcon = svgIcons.find(
      (icon: { name: string; width: number; height: number; svg: string }) => icon.name === this.icon,
    );

    if (svgIcon) {
      this.elementRef.nativeElement.style.setProperty(`--icon-width`, `${svgIcon.width}px`);

      this.elementRef.nativeElement.style.setProperty(`--icon-height`, `${svgIcon.height}px`);

      (this.elementRef.nativeElement as HTMLElement).innerHTML = svgIcon.svg;
    } else {
      throw Error(`Icon ${this.icon} not found`);
    }
  }
}
