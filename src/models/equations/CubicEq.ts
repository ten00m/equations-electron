import {RationalTheoremEq} from './methods/RationalTheoremEq'
import { fCardano } from './methods/fCardano';

export class CubicEq{
	coeffs: Array<number>
	tree: any;
	solutions: Array<any>

	constructor(coeffs: Array<any>, tree: any){
		this.coeffs = coeffs
		this.tree = tree
		this.solutions = this.solve()
	}

	private solve(): Array<any>{
		let eq = new RationalTheoremEq(this.coeffs, this.tree);
		if(eq.solutions.length === 3){
			return eq.solutions
		}
		else {
			let fCard = new fCardano(this.coeffs)
			return fCard.solutions
		}
	}
}