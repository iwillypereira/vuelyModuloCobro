export const RMT = {
    formatoPrecio: (cant_dinero) => {
        let val = (cant_dinero / 1).toFixed(2).replace(',', '.')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    redondeoArriba(value) {
        var redondear = Math.ceil(value);

        return redondear;
    },
}