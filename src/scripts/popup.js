var model = bond.Create();
function bindMembers(members){
  model.members = members;
}
function resetMembers(members){
  members.forEach(m=>{
    m.current=false;
    m.bold=false;
    m.completed=false;
  });
  bindMembers(members);
}
function loadData(_client, webContext){
    const projectId = webContext.project.id;
    const teamId = webContext.team.id;

    let counter = 0;

    _client.getTeamMembersWithExtendedProperties(projectId, teamId, 100, 0).then((members) => {

      const randomRange = (min, max) => Math.random() * (max - min) + min;

      const key = (new Intl.DateTimeFormat().format(new Date())).replace(/\//g, "");
      const storage = JSON.parse(localStorage.getItem(key));

      const questionOfTheDay = storage.question;
      let completedTeamMembers = storage.members;

      question.innerText = questionOfTheDay.text;

      let notCompletedTeamMembers = members;

      
      bindMembers(members);

      const startRandomizer = () => {
        let randomizer = 0;
        const randomNumber = () => {
          resetMembers(members);
          const randomIndex = Math.floor(Math.random() * members.length);
          let randomMember=members[randomIndex]
          members[randomIndex].bold=true;
          bindMembers(members);
          

          if (randomizer++ > 20) {
            clearInterval(timer);

            members[randomIndex].current=true;
            bindMembers(members);
         
            localStorage.setItem(key, JSON.stringify({question: questionOfTheDay, members: completedTeamMembers}));

            buttonNext.disabled = false;
          }
        }

        let timer = 0;

        if (notCompletedTeamMembers.length > 0) {
          if (notCompletedTeamMembers.length === 1) {
            const randomMember = notCompletedTeamMembers[0];

            team.querySelectorAll("tr").forEach((row) => {
              row.classList.remove("bold");
            });

            const memberElement = document.getElementById(`member-${randomMember.identity.id}`);
            memberElement.classList.add("bold");
            memberElement.style.color = "green";

            completedTeamMembers.push(randomMember.identity.id);

            localStorage.setItem(key, JSON.stringify({question: questionOfTheDay, members: completedTeamMembers}));
          } else {
            timer = setInterval(randomNumber, 80);
          }
        }
      };

      buttonStartOver.addEventListener("click", () => {
        resetMembers(members);
        canvas.style.display = "none";
        message.style.display = "none";
        buttonNext.disabled = false;

        const key = (new Intl.DateTimeFormat().format(new Date())).replace(/\//g, "");
        localStorage.removeItem(key);

        completedTeamMembers = [];
        notCompletedTeamMembers = members.slice();
      });

      buttonNext.addEventListener("click", () => {
        canvas.style.display = "none";
        message.style.display = "none";
        buttonNext.disabled = true;
        startRandomizer();
        return;
        let completed = document.getElementsByClassName('completed');
        let green = document.getElementsByClassName('green');
        let finished = completed.length + green.length;
        console.log("finished=" + finished);

        let limit = (members.length-1);
        console.log("limit=" + limit)
        if (limit === 0) {
          canvas.style.display = "block";
          message.style.display = "block";

          const ctx = canvas.getContext("2d");
          let cx = ctx.canvas.width / 2;
          let cy = ctx.canvas.height / 2;
  
          let confetti = [];
          const confettiCount = 600;
          const gravity = 0.5;
          const terminalVelocity = 5;
          const drag = 0.075;
          const colors = [
            { front: 'red', back: 'darkred' },
            { front: 'green', back: 'darkgreen' },
            { front: 'blue', back: 'darkblue' },
            { front: 'yellow', back: 'darkyellow' },
            { front: 'orange', back: 'darkorange' },
            { front: 'pink', back: 'darkpink' },
            { front: 'purple', back: 'darkpurple' },
            { front: 'turquoise', back: 'darkturquoise' }];
  
          const initConfetti = () => {
            for (let i = 0; i < confettiCount; i++) {
              confetti.push({
                color: colors[Math.floor(randomRange(0, colors.length))],
                dimensions: { x: randomRange(10, 20), y: randomRange(10, 30) },
                position: { x: randomRange(0, canvas.width), y: canvas.height - 1 },
                rotation: randomRange(0, 2 * Math.PI),
                scale: { x: 1, y: 1 },
                velocity: { x: randomRange(-25, 25), y: randomRange(0, -50) }
              });
            }
          };
  
          const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
  
            confetti.forEach((confetto, index) => {
              let width = confetto.dimensions.x * confetto.scale.x;
              let height = confetto.dimensions.y * confetto.scale.y;
  
              // Move canvas to position and rotate
              ctx.translate(confetto.position.x, confetto.position.y);
              ctx.rotate(confetto.rotation);
  
              // Apply forces to velocity
              confetto.velocity.x -= confetto.velocity.x * drag;
              confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
              confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
  
              // Set position
              confetto.position.x += confetto.velocity.x;
              confetto.position.y += confetto.velocity.y;
  
              // Delete confetti when out of frame
              if (confetto.position.y >= canvas.height) confetti.splice(index, 1);
  
              // Loop confetto x position
              if (confetto.position.x > canvas.width) confetto.position.x = 0;
              if (confetto.position.x < 0) confetto.position.x = canvas.width;
  
              // Spin confetto by scaling y
              confetto.scale.y = Math.cos(confetto.position.y * 0.1);
              ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
  
              // Draw confetti
              ctx.fillRect(-width / 2, -height / 2, width, height);
  
              // Reset transform matrix
              ctx.setTransform(1, 0, 0, 1, 0, 0);
            });

            window.requestAnimationFrame(render);
          };
          
          message.innerText = "All team members have completed updating";
  
          initConfetti();
          render();
        }
        
      });

    });
}

function loadSettingsData(_client, webContext){
  const projectId = webContext.project.id;
  const teamId = webContext.team.id;

  let counter = 0;

  _client.getTeamMembersWithExtendedProperties(projectId, teamId, 100, 0).then((members) => {
    const createRowForTeamMember = (member) => {
      const row = document.createElement("tr");
      row.id = `member-${member.identity.id}`;

      const id = document.createElement("td");
      const photo = document.createElement("td");
      const name = document.createElement("td");

      id.innerHTML = "<input type='checkbox' checked />";
      id.style.width = "10%";
      photo.innerHTML = "<img src='" + member.identity.imageUrl + "' width='44' height='44' />";
      photo.style.width = "50px";
      name.innerHTML = "<span>" + member.identity.displayName + "</span>";

      row.appendChild(id);
      row.appendChild(photo);
      row.appendChild(name);

      return row;
    }


    members.forEach((member) => {
      team.appendChild(createRowForTeamMember(member));
    });



  


  });
}