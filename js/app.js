let estadoHorno = "apagado", videoHornoActual, puertaHorno, puertaBloqueada = false;

window.onload = () => {
    videoHornoActual = document.getElementById("video-horno");
    puertaHorno = document.getElementById("puerta-horno");

    puertaHorno.onclick = () => {
        if (!puertaBloqueada) {

            if(estadoHorno == "tarta-lista") {
                estadoHorno = "retirar-lista";
            }
                else if (estadoHorno == "tarta-quemada") {
                    estadoHorno = "retirar-quemada";
                }
        
            avanzarAnimacion();
        }

    }

    function avanzarAnimacion() {
        switch (estadoHorno) {
            case "apagado":
                reproducirSonido("puerta", false);
                bloquearPuerta(true);
                mostrarVideo();
                reproducirVideo("horno-abriendo-puerta");
                cuandoTerminaAvanzarA("cocinando");
                break;

            case "cocinando" :
                reproducirVideo("horno-cocinando");
                reproducirSonido("timer", true);
                cuandoTerminaAvanzarA("tarta-lista");
                break;

            case "tarta-lista":
                detenerSonido();
                bloquearPuerta(false);
                reproducirVideo("horno-tarta-lista");
                reproducirSonido("campanita", false);
                cuandoTerminaAvanzarA("tarta-quemandose");
                loopear(10000);
                break;

            case "tarta-quemandose":
                detenerSonido();
                bloquearPuerta(true);
                reproducirVideo("horno-tarta-quemandose");
                cuandoTerminaAvanzarA("tarta-quemada");
                break;

            case "tarta-quemada":
                bloquearPuerta(false);
                reproducirVideo("horno-tarta-quemada");
                loopear();
                break;

            case "retirar-lista":
                reproducirSonido("puerta-con-tarta", false);
                bloquearPuerta(true);
                reproducirVideo("horno-retirar-lista");
                reiniciar();
                break;

            case "reitrar-quemada":
                reproducirSonido("puerta-con-tarta", false);
                bloquearPuerta(true);
                reproducirVideo('horno-retirar-quemada');
                reiniciar();
                break;          
        }
    }

    let sonido;

    function reproducirSonido(nombreSonido, loopearSonido) {
        sonido = new Audio(`sound/${nombreSonido}.mp3`);
        sonido.play();
        sonido.loop = loopearSonido;
    }

    function mostrarVideo() {
        videoHornoActual.classList.remove("hidden");
    }

    function ocultarVideo() {
        videoHornoActual.classList.add("hidden");
    }

    function reproducirVideo(nombreVideo) {
        videoHornoActual.src = `video/${nombreVideo}.webm`;
        videoHornoActual.play();
    }

    function actualizarEstadoA(estadoNuevo) {
        estadoHorno = estadoNuevo;
    }

    function cuandoTerminaAvanzarA(estadoNuevo) {
        videoHornoActual.onended = () => {
            actualizarEstadoA(estadoNuevo)
            avanzarAnimacion();
        }
    }

    function bloquearPuerta(traba) {
        puertaBloqueada = traba;
    }

    function detenerSonido() {
        sonido.pause();
    }

    function loopear(tiempo) {
        videoHornoActual.loop = true;
   
        if (time != undefined) {
            setTimeout(() => {
                desloopear();
            }, 10000);

        }


    }

    function desloopear() {
        videoHornoActual.loop = false;
    }

    function reiniciar() {
        desloopear();
        videoHornoActual.onended = () => {
            actualizarEstadoA("apagado");
            ocultarVideo();
            bloquearPuerta(false);
            rotacionPerilla(0);
        }
    }

    const MAX_PLAYBACK_RATE = 16, MIN_PLAYBACK_RATE = 1;

    let perillaHorno = document.getElementById("perilla-horno"), rotacionPerilla = 0;
    perillaHorno.onmousewheel = (data) => {
        console.log(data.deltaY);
        if(estadoHorno == "cocinando" || estadoHorno == "tarta-lista"){
            cambiarTemperatura(data);
        }
    }

    function cambiarTemperatura(dataRecibida) {
        if(dataRecibida.deltaY < 0 && videoHornoActual.playbackRate < MAX_PLAYBACK_RATE) {
            rotarPerilla("derecha")
            videoHornoActual.playbackRate = videoHornoActual.playbackRate + 0.5;
        } else if(dataRecibida.deltaY > 0 && videoHornoActual.playbackRate > MIN_PLAYBACK_RATE){
            rotarPerilla("izquierda");
            videoHornoActual.playbackRate = videoHornoActual.playbackRate - 0.5;
        }
    }

    function rotarPerilla(direccion) {
        if (direccion === "derecha") {
            rotarPerilla = rotarPerilla + 2.5;
        } else if (direccion === "izquierda") {
            rotarPerilla = rotarPerilla - 2.5;
        } else {
            rotarPerilla = direccion;
        }
        perillaHorno.style.transform = `rotate(${rotacionPerilla}deg)`;
    }

}