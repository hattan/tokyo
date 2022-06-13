members = []
for(let i=1;i<=4;i++){
    members.push({
        identity: {
            id: i,
            displayName: "test person " + i,
            imageUrl: "https://randomuser.me/api/portraits/lego/1.jpg"
        }
    })
}

console.log(members);