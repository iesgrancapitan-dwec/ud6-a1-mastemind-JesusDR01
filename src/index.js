/**
 * @author Jesús Diaz Rivas
 * 1. Utilizando closures, créate un objeto MasterMind al que puedas invocar los siguientes métodos:
 * 1. MasterMind.init(): genera una combinación objetivo. Será la que el jugador debe adivinar.
 * 2. MasterMind.mostrar(): muestra la combinación objetivo por consola. Nos facilitará a la hora de hacer pruebas. Ejecutadlo para facilitar la corrección.
 * 3. MasterMind.comprobarCoincidencia(intento): genera una combinación de negros (número de bolas que están en su sitio) y blancos (número de bolas
 * que están, pero no en su sitio).
 */

// {
const MasterMind = (function () {
    const ALL_COLORS = [
        "red",
        "white",
        "black",
        "yellow",
        "orange",
        "saddlebrown",
        "blue",
        "green",
    ];
    const MAX_REQUESTED_COLORS = 4;
    const REPEAT_WINNER_COLORS = true;
    let winnerColors = [];
    return {
        init() {
            if (REPEAT_WINNER_COLORS) {
                winnerColors = Array.from(
                    { length: MAX_REQUESTED_COLORS },
                    (k, v) => ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)]
                );
            } else {
                winnerColors = ALL_COLORS.sort((a, b) => 0.5 - Math.random()).slice(
                    0,
                    MAX_REQUESTED_COLORS
                ); //50% chance element go up/down in array
            }
        },
        show() {
            console.log(winnerColors);
        },
        check(requestedColors) {
            if (requestedColors.length > 4) {
                throw new Error(`You can only request for ${MAX_REQUESTED_COLORS} colors`);
            }
            const auxRequestedColors = [...requestedColors];
            const output = winnerColors.reduce(
                (colors, winnerColor, index) => {
                    if (winnerColor === requestedColors[index]) {
                        colors.black++;
                    } else if (auxRequestedColors.includes(winnerColor)) {
                        colors.white++;
                    }
                    auxRequestedColors.splice(auxRequestedColors.indexOf(winnerColor), 1);
                    return colors;
                },
                { black: 0, white: 0 }
            );
            return output;
        },
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    MasterMind.init();
    const firstLine = document.querySelector(".line");
    let main = document.querySelector("main");
    let defaultLine = firstLine.cloneNode(true);
    let defaultMain = main.cloneNode(true);
    let currentHoles = Array.from(firstLine.querySelectorAll(".hole"));
    let currentResults = Array.from(firstLine.querySelectorAll(".result"));
    console.log(MasterMind.show());
    const resetBackground = function () {
        this.style.backgroundColor = "grey";
        this.setAttribute("data-free", true);
    };
    document.querySelectorAll("aside div:not(#check)").forEach((el) => {
        el.style.backgroundColor = el.id;
        el.addEventListener("click", () => {
            const firstFreeHole = currentHoles.find((el) => el.dataset.free === "true");
            if (firstFreeHole) {
                firstFreeHole.style.backgroundColor = el.id;
                firstFreeHole.setAttribute("data-free", false);
                firstFreeHole.addEventListener("click", resetBackground);
            }
        });
    });
    document.querySelector("#check").addEventListener("click", () => {
        if (currentHoles.every((el) => el.dataset.free === "false")) {
            const hints = MasterMind.check(currentHoles.map((el) => el.style.backgroundColor));
            const blackElements = currentResults.splice(0, hints.black);
            const whiteElements = currentResults.splice(0, hints.white);
            blackElements.forEach((el) => (el.style.backgroundColor = "black"));
            whiteElements.forEach((el) => (el.style.backgroundColor = "white"));
            if (blackElements.length === 4) {
                Swal.fire({
                    title: "You won!!",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                    background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
                    backdrop: `
                      rgba(0,0,123,0.4)
                      url("https://sweetalert2.github.io/images/nyan-cat.gif")
                      left top
                      no-repeat
                    `,
                    confirmButtonText: "Play again",
                }).then(() => {
                    MasterMind.init();
                    MasterMind.show();
                    main.innerHTML = defaultMain.innerHTML;
                });
            }
            currentHoles.forEach((el) => el.removeEventListener("click", resetBackground));
            const currentLine = defaultLine.cloneNode(true);
            main.append(currentLine);
            currentHoles = Array.from(currentLine.querySelectorAll(".hole"));
            currentResults = Array.from(currentLine.querySelectorAll(".result"));
            main.scrollTop -= firstLine.scrollHeight + 1;
        }
    });
});
