using { Currency,managed,sap,cuid } from '@sap/cds/common';

namespace my.autosDev;
entity carros : cuid,managed {
    
    nombre : String(255);
    apellido : String(255);
    color : String(255);
    anio_Modelo : Integer;
    serial : String(255);
    precio : Integer;

}