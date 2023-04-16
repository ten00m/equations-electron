
let equatStr = ''
const equatInp = document.getElementById('equatInp');
const solveBtn = document.getElementById('solvebtn');
const latexInp = document.getElementById('latexInp');
const latexOut = document.getElementById('latexOut')

solveBtn.addEventListener('click', (e) => {
    const body = {
        equat: equatStr
    }

    let solutionTex = []
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
            solutionTex = JSON.parse(r)
            latexOut.innerHTML = ''
            console.log(solutionTex)
            if(solutionTex.length === 0){
                const parsedRoots = document.createElement('div');
                parsedRoots.className = 'root';
                latexOut.appendChild(parsedRoots)

                katex.render(String.raw`x \in \varnothing`, parsedRoots)
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



