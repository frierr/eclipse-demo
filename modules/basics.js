export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function fastRoot(number, approximation) {
    return 0.5 * (number / approximation + approximation);
}