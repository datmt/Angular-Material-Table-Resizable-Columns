import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {


  movingRight: boolean = false;
  isDragging: boolean = false;
  currentScreenX : number = 0;
  originalColWidth: number = 0;
  colName: string = '';
  
  constructor( private renderer: Renderer2 ) { }

  ngOnInit(): void {

    this.renderer.listen('document', 'mousemove', (event) => {
      
      if (!this.isDragging) {
        return;
      }

      const elementRect = this.getElementRectByColName(this.colName);

      if (elementRect === null) {
        console.log("it's null");
        return;
      }
      console.log("listening",  event.pageX, "elementRect.left: ", elementRect.left, " elementRect.width");
      const deltaWidth = event.pageX - (elementRect.left + this.originalColWidth);

      if (Math.abs(deltaWidth) < 5) {
        return;
      }
      this.movingRight = deltaWidth >= 0;
  
      const newWidth = this.originalColWidth + deltaWidth;
      this.setColumnWidth(this.colName, newWidth);
    });

  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  
  dragStart(event: any, colName: string) {
    console.log(event);
    this.isDragging = true;
    this.currentScreenX = event.screenX;
    // this.setColumnWidth("position", 20);
    let el = this.getElementRectByColName(colName);
    if (el === null) {
      console.log('element is null')
      return;
    }
      
    event.preventDefault();

    this.originalColWidth = el.width;
    this.colName = colName;
    this.dragging();
  }


  dragging() {
    
  



  }

  @HostListener('document:mouseup', ['$event'])
  dragEnd(event: any) {
    this.isDragging = false;
    console.log(" NOT DRAGGING");
  }

  resizeColumn(colName: string) {
    console.log()
  }


  getElementRectByColName(colName: string) {

    const cols = document.getElementsByClassName('mat-column-' + colName);
    if (cols.length > 0)
      return cols[0].getBoundingClientRect();
    return null;
  }

  setColumnWidth(columnName: any, newWidth: number) {
    console.log('setting width: ', 'mat-column-' + columnName);
    const columnEls = Array.from( document.getElementsByClassName('mat-column-' + columnName) );
    columnEls.forEach(( el: Element ) => {
      if (newWidth > 100 && newWidth < 600) {
        el.setAttribute("width", newWidth + "px")
      }
      
      
      
    });
  }



}
