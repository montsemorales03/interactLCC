// Datos de la malla curricular
const mallaData = [
    {
        nivel: 1,
        ramos: [
            { nombre: "álgebra I", prerequisitos: [] },
            { nombre: "cálculo I", prerequisitos: [] },
            { nombre: "computación I", prerequisitos: [] },
            { nombre: "Introducción a la CS", prerequisitos: [] },
            { nombre: "Inglés I", prerequisitos: [] }
        ]
    },
    {
        nivel: 2,
        ramos: [
            { nombre: "álgebra II", prerequisitos: ["álgebra I"] },
            { nombre: "cálculo II", prerequisitos: ["cálculo I"] },
            { nombre: "estructura de datos", prerequisitos: ["computación I"] },
            { nombre: "español I", prerequisitos: ["Introducción a la CS"] },
            { nombre: "inglés II", prerequisitos: ["Inglés I"] }
        ]
    },
    {
        nivel: 3,
        ramos: [
            { nombre: "álgebra lineal", prerequisitos: ["álgebra II"] },
            { nombre: "calculo III", prerequisitos: ["cálculo II"] },
            { nombre: "introducción a la física", prerequisitos: ["cálculo II"] },
            { nombre: "paradigmas de programación", prerequisitos: ["estructura de datos"] },
            { nombre: "ingles III", prerequisitos: ["inglés II"] }
        ]
    },
    {
        nivel: 4,
        ramos: [
            { nombre: "probabilidad y estadística", prerequisitos: ["calculo III"] },
            { nombre: "arquitectura de computadores", prerequisitos: ["introducción a la física"] },
            { nombre: "programación avanzada", prerequisitos: ["paradigmas de programación"] },
            { nombre: "matemática discreta", prerequisitos: ["álgebra lineal", "estructura de datos"] },
            { nombre: "ingles IV", prerequisitos: ["ingles III"] }
        ]
    },
    {
        nivel: 5,
        ramos: [
            { nombre: "estadística II", prerequisitos: ["probabilidad y estadística"] },
            { nombre: "sistemas operativos", prerequisitos: ["arquitectura de computadores", "paradigmas de programación"] },
            { nombre: "modelamiento de BDD", prerequisitos: ["paradigmas de programación", "álgebra lineal"] },
            { nombre: "fundamentos cs I", prerequisitos: ["programación avanzada", "matemática discreta"] },
            { nombre: "lógica computacional", prerequisitos: ["matemática discreta"] }
        ]
    },
    {
        nivel: 6,
        ramos: [
            { nombre: "comunicación de computadores", prerequisitos: ["sistemas operativos"] },
            { nombre: "modelamientos de BDD científicos", prerequisitos: ["modelamiento de BDD"] },
            { nombre: "fundamentos cs II", prerequisitos: ["fundamentos cs I"] },
            { nombre: "algoritmos distribuidos", prerequisitos: ["fundamentos cs I", "lógica computacional"] },
            { nombre: "ingeniería en software I", prerequisitos: ["modelamiento de BDD", "programación avanzada"] }
        ]
    },
    {
        nivel: 7,
        ramos: [
            { nombre: "metodología de la investigación", prerequisitos: ["estadística II", "español I", "ingles IV"] },
            { nombre: "simulación computacional", prerequisitos: ["estadística II"] },
            { nombre: "electivo I", prerequisitos: ["fundamentos cs II"] },
            { nombre: "electivo II", prerequisitos: ["fundamentos cs II"] },
            { nombre: "ingeniería en software II", prerequisitos: ["ingeniería en software I"] }
        ]
    },
    {
        nivel: 8,
        ramos: [
            { nombre: "metodología de la investigación II", prerequisitos: ["metodología de la investigación", "simulación computacional"] },
            { nombre: "ética", prerequisitos: ["metodología de la investigación", "comunicación de computadores"] },
            { nombre: "electivo III", prerequisitos: ["electivo I"] },
            { nombre: "electivo IV", prerequisitos: ["electivo II"] },
            { nombre: "ingeniería en software III", prerequisitos: ["ingeniería en software II"] }
        ]
    },
    {
        nivel: 9,
        ramos: [
            { nombre: "seminario de titulo I", prerequisitos: ["metodología de la investigación II", "ética", "electivo III", "electivo IV", "ingeniería en software III"] },
            { nombre: "practica profesional", prerequisitos: ["metodología de la investigación II", "ética", "electivo III", "electivo IV", "ingeniería en software III"] },
            { nombre: "electivo V", prerequisitos: ["electivo IV"] },
            { nombre: "evaluación de proyectos informáticos", prerequisitos: ["ingeniería en software III"] }
        ]
    },
    {
        nivel: 10,
        ramos: [
            { nombre: "seminario de titulo II", prerequisitos: ["seminario de titulo I"] },
            { nombre: "innovación y emprendimiento", prerequisitos: ["practica profesional", "evaluación de proyectos informáticos"] },
            { nombre: "gestión tecnológica", prerequisitos: ["evaluación de proyectos informáticos"] }
        ]
    }
];

// Estado de la aplicación
let approvedCourses = new Set();
let totalCourses = 0;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    renderMalla();
    document.getElementById('reset-btn').addEventListener('click', resetProgress);
});

// Renderizar la malla completa
function renderMalla() {
    const container = document.getElementById('malla-container');
    container.innerHTML = '';
    totalCourses = 0;

    mallaData.forEach(nivel => {
        const nivelElement = document.createElement('div');
        nivelElement.className = 'nivel';

        const nivelHeader = document.createElement('div');
        nivelHeader.className = 'nivel-header';
        nivelHeader.textContent = `Nivel ${nivel.nivel}`;
        nivelElement.appendChild(nivelHeader);

        const ramosContainer = document.createElement('div');
        ramosContainer.className = 'ramos-container';

        nivel.ramos.forEach(ramo => {
            totalCourses++;
            const ramoElement = document.createElement('div');
            ramoElement.className = 'ramo locked';
            ramoElement.dataset.nombre = ramo.nombre;
            ramoElement.dataset.prerequisitos = JSON.stringify(ramo.prerequisitos);

            const ramoName = document.createElement('div');
            ramoName.className = 'ramo-name';
            ramoName.textContent = ramo.nombre;
            ramoElement.appendChild(ramoName);

            if (ramo.prerequisitos.length > 0) {
                const prerequisitosElement = document.createElement('div');
                prerequisitosElement.className = 'prerequisitos';
                prerequisitosElement.textContent = `Prerrequisitos: ${ramo.prerequisitos.join(', ')}`;
                ramoElement.appendChild(prerequisitosElement);
            }

            ramoElement.addEventListener('click', toggleCourse);
            ramosContainer.appendChild(ramoElement);
        });

        nivelElement.appendChild(ramosContainer);
        container.appendChild(nivelElement);
    });

    updateAllCourses();
    updateStats();
}

// Alternar estado de aprobación de un ramo
function toggleCourse(event) {
    const ramoElement = event.currentTarget;
    const courseName = ramoElement.dataset.nombre;

    if (ramoElement.classList.contains('locked')) return;

    if (approvedCourses.has(courseName)) {
        approvedCourses.delete(courseName);
        ramoElement.classList.remove('approved');
        ramoElement.classList.add('available');
    } else {
        approvedCourses.add(courseName);
        ramoElement.classList.remove('available');
        ramoElement.classList.add('approved');
    }

    updateAllCourses();
    updateStats();
    saveProgress();
}

// Actualizar el estado de todos los ramos
function updateAllCourses() {
    document.querySelectorAll('.ramo').forEach(ramoElement => {
        const courseName = ramoElement.dataset.nombre;
        const prerequisites = JSON.parse(ramoElement.dataset.prerequisitos);

        if (approvedCourses.has(courseName)) {
            ramoElement.classList.remove('available', 'locked');
            ramoElement.classList.add('approved');
        } else {
            const allPrerequisitesMet = prerequisites.every(req => approvedCourses.has(req));
            
            if (allPrerequisitesMet) {
                ramoElement.classList.remove('locked');
                ramoElement.classList.add('available');
            } else {
                ramoElement.classList.remove('available');
                ramoElement.classList.add('locked');
            }
        }
    });
}

// Actualizar estadísticas
function updateStats() {
    document.getElementById('approved-count').textContent = approvedCourses.size;
    document.getElementById('total-count').textContent = totalCourses;
}

// Reiniciar progreso
function resetProgress() {
    approvedCourses.clear();
    updateAllCourses();
    updateStats();
    localStorage.removeItem('mallaProgress');
}

// Guardar progreso en localStorage
function saveProgress() {
    localStorage.setItem('mallaProgress', JSON.stringify(Array.from(approvedCourses)));
}

// Cargar progreso desde localStorage
function loadProgress() {
    const savedProgress = localStorage.getItem('mallaProgress');
    if (savedProgress) {
        approvedCourses = new Set(JSON.parse(savedProgress));
        updateAllCourses();
        updateStats();
    }
}

// Cargar progreso al iniciar
loadProgress();
