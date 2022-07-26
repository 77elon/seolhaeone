document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("#inputPassword");
    input.addEventListener('input', (e) => {
        if (e.target.value)
        {
            const x = e.target.value.replace(/[^a-zA-Z_0-9,\.]/g, '').match(/(\w{0,3})(\w{0,3})/);
            e.target.value = !x[2] ? x[1] :  x[1] + (x[2] ? '-' + x[2] : '');
        }
    });
});