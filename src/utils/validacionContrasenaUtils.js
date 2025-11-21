export function validarFortalezaContrasena(contrasena) {
    const requisitos = {
        longitud: contrasena.length >= 8,
        minuscula: /[a-z]/.test(contrasena),
        mayuscula: /[A-Z]/.test(contrasena),
        numero: /[0-9]/.test(contrasena),
        simbolo: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(contrasena)
    };

    const cumplidos = Object.values(requisitos).filter(Boolean).length;
    
    let fortaleza = 'débil';
    let color = 'red';
    let colorTailwind = 'bg-red-500';
    
    if (cumplidos === 5) {
        fortaleza = 'fuerte';
        color = 'green';
        colorTailwind = 'bg-green-500';
    } else if (cumplidos >= 3) {
        fortaleza = 'media';
        color = 'yellow';
        colorTailwind = 'bg-yellow-500';
    }

    return {
        requisitos,
        fortaleza,
        color,
        colorTailwind,
        cumplidos,
        valida: cumplidos === 5
    };
}

export function obtenerMensajesRequisitos(requisitos) {
    const mensajes = [];
    
    if (!requisitos.longitud) mensajes.push('Mínimo 8 caracteres');
    if (!requisitos.minuscula) mensajes.push('Una letra minúscula');
    if (!requisitos.mayuscula) mensajes.push('Una letra mayúscula');
    if (!requisitos.numero) mensajes.push('Un número');
    if (!requisitos.simbolo) mensajes.push('Un símbolo (!@#$%^&*...)');
    
    return mensajes;
}