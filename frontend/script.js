
let equatStr = ''
const equatInp = document.getElementById('equatInp');
const solveBtn = document.getElementById('solvebtn');
const latexInp = document.getElementById('latexInp');
const latexOut = document.getElementById('latexOut');
const stepByStepOut = document.getElementById('stepByStep');


solveBtn.addEventListener('click', (e) => {
    const body = {
        equat: equatStr
    }

    let solObj = []
    let response = fetch('/api/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    
    response
        .then(r => r.text())
        .then(r => {

            latexOut.innerHTML = ''

            solObj = JSON.parse(r);
            const solutionTex = solObj.solTex;
            const stepByStep = solObj.stepByStep

            latexOut.innerHTML = ''
            stepByStepOut.innerHTML = ''

            for(let step of stepByStep){
                const elem = document.createElement('div');
                elem.className = 'stepByStep_element';
                stepByStepOut.appendChild(elem);

                if(step[0]){
                    const stepText = document.createElement('p');
                    stepText.innerHTML = step[0];

                    elem.appendChild(stepText)
                }
                if(step[1]){
                    const stepTex = document.createElement('div');
                    stepTex.className = 'stepTex'

                    katex.render(step[1], stepTex);


                    elem.appendChild(stepTex)
                }


            }

            if(solutionTex.length === 0){

                const parsedRoots = document.createElement('div');
                parsedRoots.className = 'root';
                latexOut.appendChild(parsedRoots)

                katex.render(String.raw`\text{Корни не найдены}`, parsedRoots)
            } else {
                solutionTex.map((root, ind) => {

                    const parsedRoot = document.createElement('div');
                    parsedRoot.className = 'root'
    
                    latexOut.appendChild(parsedRoot);
    
                    katex.render(`x_${ind+1} = ${root}`, parsedRoot)
                })
            }

        })

})

equatInp.addEventListener('input', (event) => {
    equatStr = event.target.value
    latexOut.innerHTML = ''


    const res = fetch('/api/parse', {
        method: 'POST',
        body: equatStr
    })

    res
        .then(res => res.text())
        .then(res => {
            if(res){
                katex.render(res, latexInp)
            } else{
                latexInp.innerHTML =''
            }
        })

})



