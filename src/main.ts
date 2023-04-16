import { app, BrowserWindow } from 'electron'
import path from 'path'
import express from 'express'
import { Parser } from './models/utils/Parser'
import { Equation } from './models/Equation'

const PORT = process.env.PORT || 12345

let win: BrowserWindow | null

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#fff',
        autoHideMenuBar: true,
    })

    win.title = 'Equations Calculator'
    win.loadURL(`http://localhost:${PORT}`)
    win.on('closed', () => {
        win = null
    })
}

if(app){
    app.on('ready', () => {
        createWindow()
    })

    app.on('window-all-closed', () => {
        if(process.platform !== 'darwin'){
            app.quit()
        }
    })

    app.on('activate', () => {
        if(win === null){
            createWindow()
        }
    })
}

const parser = new Parser()

const getParsedTex = (equatStr: string) => {
    equatStr = parser.parseTex(equatStr)
    return equatStr
}

const solve = (equatStr: string) => {

}

const expressApp: express.Application = express()

expressApp.use(express.static(path.join(__dirname, "../frontend")))
expressApp.use(express.json(), express.text())

expressApp.post("/api/solve", async (req, res) => {
    const equatStr = req.body.equat    
    
    const equation = new Equation(equatStr);
    
    const solution = equation.solve()
    if(solution){
        const solTex = solution.map(root => root.toTex())
        res.send(JSON.stringify(solTex))
    } else{
        res.send(String.raw`x\in\emptyset`)
    }
    
    
})

expressApp.post('/api/parse', async (req, res) => {
    const equatStr = req.body
    const parsedTex = getParsedTex(equatStr)
    res.send(parsedTex)
})

expressApp.all("*", async (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

expressApp.listen(PORT, () => {
    console.log(`Running (port ${PORT})`)
})