using { my.autosDev as db } from '../db/schema';


service consesionarios {

    entity ventas as projection on db.carros;

}