export function random(len: number){
    let letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    const length = letter.length;
    let ans = "";
    for(let i=0;i<len;i++){
        ans += letter[Math.floor(Math.random()*length)];
    }
    return ans;
}