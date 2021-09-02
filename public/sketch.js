/*

TODO

pick styles/styling 2
algorithms: ga

BUG:

V2 
img
visualization for algo button 
mobile 2

TODONE
convert findShortest algo argument to string
get canvas appropriate size
Interface: algo select, run, clear+, display data
pointer within canvas
Add greyed out path beneath optimal one 
mobile ish
Squashed: Algo erases all points but brings back after point placed
Color Options for path and secondaary path
*/

let points = [],
    ogPoints = [],
    algos = ['bruteforce', 'myheat', 'wikiheat', 'ga', 'bb'],
    p = 0,
    color = 255,
    current, bkg

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(100, 2, 34)
    frameRate(10)
}

function mousePressed() {
    // if (mouseY > 0) points.push(new Point(mouseX, mouseY))
    if (mouseY > 0) points.push([mouseX, mouseY])
    show(points)
}

function delLastPt() {
    points.splice(points.length - 1, 1)
    show(points)
}

function show(arr) {
    if (bkg) background(bkg)
    else background(100, 2, 34)
    stroke(color)
    strokeWeight(6)
    noFill()
    beginShape()
    for (let i = 0; i < arr.length; i++) {
        vertex(arr[i][0], arr[i][1])
        ellipse(arr[i][0], arr[i][1], 4, 4)
    }
    endShape()
    document.getElementById('points').innerHTML = `Points: ${points.length}`
    document.getElementById('og-dist').innerHTML =
        `Original Length: ${pathDist(points).toFixed(3)}`
}

function clr() {
    points = [];
    show(points)
    document.getElementById('points').innerHTML = `Points: ${points.length}`
    document.getElementById('og-dist').innerHTML = 'Original Length: 0'
    document.getElementById('shortest').innerHTML = 'Shortest Distance: 0'
}

function col(e) {
    e.className = color == 0 ? 'btn btn-dark' : 'btn btn-light'
    color = color == 0 ? 255 : 0

    show(points)
}

function run(algo) {
    if (points.length > 2) {
        let algorithm = algo != 'algorithm' ? algo : 'bruteforce',
            route = shortPath(algorithm, points, p)
        show(route[0])
        if (points.length != 0) {
            stroke(color == 0 ? 255 : 0)
            strokeWeight(2)
            noFill()
            beginShape()
            for (let i = 0; i < ogPoints.length; i++) vertex(ogPoints[i][0], ogPoints[i][1])
            endShape()
        }
        document.getElementById('shortest').innerHTML =
            `Shortest Distance: ${route[1].toFixed(3)}`
        document.getElementById('og-dist').innerHTML =
            `Original Length: ${route[2]}`
    }
}

function picture(img) {
    // console.log('image', img)
    img.crossOrigin = "Anonymous";
    let pic = loadImage(img.name)
    // console.log('picture', pic)
    bkg = pic
    show(points)
}

function pathDist(arr) { //[[2],[2],[2],[2]]
    let dis = 0
    for (d = 0; d < arr.length - 1; d++) {
        dis += dist(arr[d][0], arr[d][1], arr[d + 1][0], arr[d + 1][1])
    }
    return dis
}

function shortPath(algo, arr, p) {
    if (arr.length < 2) return //more than two points
    if (!algo) return [
        [width / 2, height / 2]
    ]
    let sPL = pathDist(points),
        ogPL = pathDist(points),
        sP

    switch (algo) {
        case 'bruteforce':

            let ar1 = perm(arr)
            for (let s = 0; s < ar1.length; s++) {
                let dis = 0
                for (let d = 0; d < ar1[s].length - 1; d++) {
                    dis += dist(ar1[s][d][0],
                        ar1[s][d][1],
                        ar1[s][d + 1][0],
                        ar1[s][d + 1][1])
                }
                if (dis < sPL) {
                    sPL = dis
                    sP = ar1[s]
                }
            }
            break;
        case "myheat":

            let P = p || random(100),
                heat = map(P, 0, 100, 0, 1),
                decay = 0.1,
                ar = [...arr], //this doesnt work
                dis = 0
            sP = ar

            // assess length
            // pick random elements (heat) swap with another element rand
            // assess length change shortest if needed

            while (heat > 0) {
                for (let r = 0; r < ar.length; r++) {
                    if (random(1) < heat) {
                        let k = floor(random(ar.length - 1))
                        if (k == r) k = r + 1
                        let ar2
                        ar2 = [...ar] // neither does this lol
                        let tem = ar[r]
                        ar[r] = ar[k]
                        ar[k] = tem
                        dis = 0
                        for (let di = 0; di < ar.length - 1; di++) dis += dist(ar[di][0], ar[di][1], ar[di + 1][0], ar[di + 1][1])
                        if (dis < sPL) {
                            sPL = dis
                            sP = ar
                            heat -= decay
                        }
                    }
                }
                heat -= decay
            }
            flag = false
            current = sP
            break;
        case 'wikiheat':
            break;
        case 'ga':
            // Initialization Evaluation Selection -Crossover -Mutation - And repeat! 
            break;

        case 'bb':
            /*
            //B will denote the best solution found so far, and will be used as an upper bound on candidate solutions.
            Initialize a queue to hold a partial solution with none of the variables of the problem assigned.
            //Loop until the queue is empty:
            //Take a node N off the queue.
           // If N represents a single candidate solution x and f(x) < B, then x is the best solution so far. 
            // Record it and set B ← f(x).
            //Else, branch on N to produce new nodes Ni. For each of these:
            //If bound(Ni) > B, do nothing; since the lower bound on this node is greater than the upper bound of the problem, 
            //it will never lead to the optimal solution, and can be discarded.
           // Else, store Ni on the queue.
            */

            let B = sPL, //num
                q = [], //contains arrs
                bP //list
            for (let i = 0; i < arr.length; i++) {
                let ar = arr.slice()
                ar.splice(i, 1)
                for (let j = 0; j < ar.length; j++) q.push([arr[i], ar[j]])
            }
            //q is first second pairs
            while (q.length != 0) sol(q.splice(0, 1)) //arr maybe of arrs    

            sP = bP
            sPL = pathDist(sP)

            //b will be adding next city on this list disjoint, fewr branches further up tree
            function branch(a) {
                //arr
                let k = arr.slice(),
                    n = []
                for (let i = 0; i < k.length; i++) {
                    console.log('is', a, k[i], contains(a[0],k[i]))

                    if (!contains(a[0],k[i])){
                        let b = a.slice()
                        console.log('bruh', b, a)
                        b.push(k[i])
                        n.push(b)
                    }
                }
                // console.log(n)
                return n
                //return arr of arrs
            }

            //lb is going to be pathdist of partial sols
            function bound(s) {
                // list
                // console.log('s', s[0])
                return pathDist(s[0])
                //return num
            }

            function sol(n) {
                //arr or list
                if (n.length == arr.length) { //if list
                    if (pathDist(n[0]) < B) {
                        bP = n[0]
                        console.log('bp', bP)
                        B = pathDist(bP)
                    }
                } else { //if arr
                    let N = branch(n) //arr of arrs
                    for (let s = 0; s < N.length; s++) {
                        if (bound(N[s]) < B) q.push(N[s]) // arr
                    }
                }
            }

            break;


        default:
            sP = arr
            console.log('huh')
            break;
    }
    // end of algos
    ogPoints = arr
    points = sP
    return [sP, sPL.toFixed(3), ogPL.toFixed(3)]
}

function perm(arr) {
    let base = []
    for (let i = 0; i < arr.length; i++) base.push(i)
    let list = [base.slice()],
        bigK
    while (bigK != -1) {
        bigK = -1
        let bigM = -1
        for (let k = 0; k < base.length - 1; k++)
            if (base[k] < base[k + 1]) bigK = k
        for (let m = 0; m < base.length; m++)
            if (base[bigK] < base[m]) bigM = m
        let heat = base[bigK]
        base[bigK] = base[bigM]
        base[bigM] = heat
        let rbase = base.splice(0, bigK + 1).concat(base.reverse())
        if (bigK != -1) list.push(rbase)
        base = rbase.slice()
    }
    let array = []
    for (let p = 0; p < list.length; p++) {
        let ordered = []
        for (let q = 0; q < list[p].length; q++) ordered.push(arr[list[p][q]])
        array.push(ordered)
    }
    return array
}

function contains(arr, obj) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] == obj[0] && arr[i][1] == obj[1]) return true
    }
    return false
}