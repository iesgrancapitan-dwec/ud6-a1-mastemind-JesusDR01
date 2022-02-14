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
    MasterMind.show();
    console.log("Usa MasterMind.check([...]) para comprobar las coincidencias");
});
// }
