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

    const front = {
        resetBackground: function () {
            this.style.backgroundColor = "grey";
            this.setAttribute("data-free", true);
        },
        checkLine: function () {
            const hints = this.check(front.currentHoles.map((el) => el.style.backgroundColor));
            const blackElements = front.currentResults.splice(0, hints.black);
            const whiteElements = front.currentResults.splice(0, hints.white);
            blackElements.forEach((el) => (el.style.backgroundColor = "black"));
            whiteElements.forEach((el) => (el.style.backgroundColor = "white"));
            if (blackElements.length === 4) {
                this.showWin();
            }
        },
        createLine: function () {
            this.currentHoles.forEach((el) =>
                el.removeEventListener("click", front.resetBackground)
            );
            const currentLine = front.defaultLine.cloneNode(true);
            this.main.append(currentLine);
            this.currentHoles = Array.from(currentLine.querySelectorAll(".hole"));
            this.currentResults = Array.from(currentLine.querySelectorAll(".result"));
            this.main.scrollTop -= front.firstLine.scrollHeight + 1;
        },
        populate: function () {
            this.main = document.querySelector("main");
            this.defaultMain = this.main.cloneNode(true);
            this.firstLine = document.querySelector(".line");
            this.defaultLine = this.firstLine.cloneNode(true);
            this.currentHoles = Array.from(this.firstLine.querySelectorAll(".hole"));
            this.currentResults = Array.from(this.firstLine.querySelectorAll(".result"));
        },
    };

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
        createGame() {
            this.init();
            front.populate();
            console.log(this.show());
            console.log(front);
        },
        addBehaviour() {
            document.querySelectorAll("aside div:not(#check)").forEach((colorBall) => {
                colorBall.style.backgroundColor = colorBall.id;
                colorBall.addEventListener("click", () => {
                    const firstFreeHole = front.currentHoles.find(
                        (hole) => hole.dataset.free === "true"
                    );
                    if (firstFreeHole) {
                        firstFreeHole.style.backgroundColor = colorBall.id;
                        firstFreeHole.setAttribute("data-free", false);
                        firstFreeHole.addEventListener("click", front.resetBackground);
                    }
                });
            });
            document.querySelector("#check").addEventListener("click", () => {
                if (front.currentHoles.every((el) => el.dataset.free === "false")) {
                    front.checkLine.apply(this);
                    front.createLine();
                }
            });
        },
        showWin() {
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
                this.init();
                this.show();
                front.main.innerHTML = front.defaultMain.innerHTML;
                this.createGame();
                //En lugar de borrar los event Listeners utilizo un objeto privado que representa el estado del mastermind (Front)
                //De esta manera, actualizo el main y los selectores, de modo que reutilizo los eventListeners pre-existentes.
            });
        },
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    MasterMind.createGame();
    MasterMind.addBehaviour();
});
