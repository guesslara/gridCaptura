/*
Funciones para el manejo del grid en la interfaz de usuario
Las funciones se acompañan del uso de la libreria jquery
Las peticiones ajax hacia el servidor se realizan tambien con jquery
Autor: Gerardo Lara
Fecha: 29-enero-2012
*/

/*++++++++++++++++++++++++++++++++*/
/**Configuracion inicial del Grid**/
/*++++++++++++++++++++++++++++++++*/

noColumnas=0;//se fija el contador inicial para las columnas; 3
gridContenedor="";
filas=0;//se fija el valor inicial del contador
contadorNombre=0;//contador para los indices enlos nombres
contadorFocus=0;//contador para los focus
cajasAnt="";//acumulador de nombres de cajas de texto
contadorRenglones=1;//contador lateral del Grid
//nombres de las columnas
//nombresCols=new Array("Imei","Sim","Serial","MFGDATE","Mensaje");
nombresCols="";
//variables para que la funcion con ajax funcione
urlPeticion="";//url de la peticion
parametrosPeticion="";//valores para la peticion ajax
//div para los posibles errores en las peticiones
divError="";
mostrarCajaResultadoG=true;

function resetDatosScriptGrid(){
   contadorNombre=0;
   contadorFocus=0;
   cajasAnt="";
   contadorRenglones=1;
   urlPeticion="";
   parametrosPeticion="";
   divError="";
   mostrarCajaResultado=true;
}

function cargaInicial(noColumnasDefinidas,divContenedor,urlPeticionUsuario,parametrosPeticionUsuario,divErrores,nombresColumnas,mostrarCajaResultado){
    resetDatosScriptGrid();
    noColumnas=noColumnasDefinidas;//se definen las columnas
    gridContenedor=divContenedor;//se establece el nombre del div
    urlPeticion=urlPeticionUsuario;//se especifica la url donde se dirigira para la peticion
    parametrosPeticion=parametrosPeticionUsuario;//parametros extra para la funcion ajax
    divError=divErrores;//div para los errores y mensajes
    nombresCols=nombresColumnas;
    mostrarCajaResultadoG=mostrarCajaResultado;
}
function inicio(){
    if(contadorNombre==0 && contadorFocus==0){	    
        var arrayColumnas="<div class='containerGridCaptura'><table id='tblGridCapturaHTML'><thead><tr><td class='cuadroGrid'>&nbsp;</td>";
        for(var i=0;i<nombresCols.length;i++){		
    	   if(i==nombresCols.length-1){
                if(mostrarCajaResultadoG){
                    arrayColumnas+="<td class='resultadoGuardadoCol'>"+nombresCols[i]+"</td>";    
                }else{
                    arrayColumnas+="<td class='cabeceraColumna'>"+nombresCols[i]+"</td>";    
                }
    	       //arrayColumnas+="<td class='resultadoGuardadoCol'>"+nombresCols[i]+"</td>";    
    	   }else{
    	       arrayColumnas+="<td class='cabeceraColumna'>"+nombresCols[i]+"</td>";    
    	   }
        }
        arrayColumnas+="</tr></thead><tbody>";
    }
    var cierreGridHTML="</tbody></table></div>";
    $("#"+gridContenedor).append(arrayColumnas+renglonGridHTML(0)+cierreGridHTML);
    contadorRenglones+=1;//se aumenta en 1 el contador de renglones
    filas=0;//se regresa el contador de columnas a 0
}
function renglonGridHTML(opcionRenglon){
    var renglonHTML="<tr>";//variable para el renglonHTML
    for(filas=filas;filas<noColumnas;filas++){
        if(filas == (noColumnas-1)){//se compara si el numero de filas es igual a las columnas -1
            if(mostrarCajaResultadoG){
                renglonHTML+="<td><input type='text' id='Resultado"+contadorNombre+"' readonly='readonly' class='resultadoGuardado' /></td>";//se concatena a la cadena con su id contenedor de la respuesta                
            }else{
                renglonHTML+="<td><input type='text' id='txt_"+contadorNombre+"' onkeypress='tecla(this.id,this.value,event)' class='datoListado' /></td>";//se concatenan las cajas necesarias con sus id's                
            }
            //renglonHTML+="<td><input type='text' id='Resultado"+contadorNombre+"' readonly='readonly' class='resultadoGuardado' /></td>";//se concatena a la cadena con su id contenedor de la respuesta
        }else{
            if(filas==0){
                renglonHTML+="<td class='cuadroGrid'>"+contadorRenglones+"</td>"
            }
            renglonHTML+="<td><input type='text' id='txt_"+contadorNombre+"' onkeypress='tecla(this.id,this.value,event)' class='datoListado' /></td>";//se concatenan las renglonHTML necesarias con sus id's
        }
        contadorNombre+=1;//se aumenta el contador para los nombres de las renglonHTML
    }
    renglonHTML+="</tr>";
    if(opcionRenglon==0){
        return renglonHTML;
    }else{
        $("#tblGridCapturaHTML").append(renglonHTML);
        contadorRenglones+=1;//se aumenta en 1 el contador de renglones
        filas=0;//se regresa el contador de columnas a 0
    }
}
function tecla(id,valor,evento){
    if(evento.which==9 || evento.which==13){
        valor=id.split("_")
        contadorFocus+=1;//se incrementa el contador para colocar el focus
        if(cajasAnt==""){//se verifica la cadena para concatenar los ids de las cajas
            cajasAnt=$("#"+id).val();;
        }else{
            cajasAnt=cajasAnt+","+$("#"+id).val();
        }
        var cajaAnterior="txt_"+(parseFloat(valor[1]));
        if(contadorFocus==(noColumnas-1)){
            cajaResultado="Resultado"+(contadorNombre-1);//caja para obtener el resultado
            //inicio();//se agrega una nueva fila
            renglonGridHTML(1);
            contadorFocus=0;//se regresa el contador del focus
            $("#"+cajaAnterior).removeClass("elementoFocus");
            $("#"+cajaAnterior).addClass("datoListado");
            $("#txt_"+(contadorNombre-noColumnas)).removeClass("datoListado");
            $("#txt_"+(contadorNombre-noColumnas)).addClass("elementoFocus");
            $("#txt_"+(contadorNombre-noColumnas)).focus();//se manda el focus a la siguiente caja
            enviaDatosServidor(cajasAnt,cajaResultado);//se envian los datos a la funcion que lo procesará
            cajasAnt="";//la variable para concatenar los ids de las cajas se reinicia
        }else{
            var nvaCaja="txt_"+(parseFloat(valor[1])+1);//se calcula la siguiente caja de texto
            $("#"+cajaAnterior).removeClass("elementoFocus");
            $("#"+cajaAnterior).addClass("datoListado");
            $("#"+nvaCaja).focus();//se manda el focus a la nueva caja de texto
            $("#"+nvaCaja).removeClass("datoListado");
            $("#"+nvaCaja).addClass("elementoFocus");
        }
    }
}

function enviaDatosServidor(cajas,cajaResultado){
    //se envia la peticion al servidor con los valores obtenidos y el resultado a la caja cajaResultado
    $("#"+cajaResultado).attr("value","Validando...");
    $("#"+cajaResultado).css("background","orange");
    $("#"+cajaResultado).css("color","black");
    //a los valores de peticion se le concatena la caja de resultado
    parametrosPeticion=parametrosPeticion+"&idElemento="+cajaResultado+"&valores="+cajas;
    //se mandan llamar las variables que contienen la peticion ajax
    ajaxAppGrid(divError,urlPeticion,parametrosPeticion);
}

function ajaxAppGrid(divDestino,url,parametros){	
    $.ajax({
        async:true,
        type: "POST",
        dataType: "html",
        contentType: "application/x-www-form-urlencoded",
        url:url,
        data:parametros,
        beforeSend:function(){ 
	       $("#"+divDestino).show().html("Cargando datos..."); 
        },
        success:function(datos){ 
	       $("#cargando").hide();
	       $("#"+divDestino).show().html(datos);		
        },
        timeout:90000000,
        error:function() { $("#"+divDestino).show().html('<center>Error: El servidor no responde. <br>Por favor intente mas tarde. </center>'); }
    });
}