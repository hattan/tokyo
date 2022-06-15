function buttonHandler(dialogService,extensionInfo, properties) {
    const options = {
      title: "Team Members",
      width: 400,
      height: 600,
      buttons: null
    };

    const questions = [
      {id:1, text: "What is the one thing you have but you wish you didn't?"},
      {id:2, text: "How much cheese is too much cheese?"},
      {id:3, text: "Tell us your favorite spot, and describe it in 3 sentence"},
      {id:4, text: "What is the strangest thing you ate?"},
      {id:5, text: "What is the one thing you would put on your 'bucket' list?"},
      {id:6, text: "Would you rather a best friend or five really good friends?"},
      {id:7, text: "What would you do on Mars for fun?"},
      {id:8, text: "Would you prefer to eat cake or pie?"},
      {id:9, text: "Are you a morning or a night person?"},
      {id:10, text: "What is your favorite movie quote and movie?"},
      {id:11, text: "Where would you go if you have 15 mins of fame?"},
      {id:12, text: "What would be a 'perfect' day for you?"},
      {id:14, text: "For what in your life do you feel most grateful?"},
      {id:15, text: "What is your most treasured memory?"},
    ];

    const finishedQuestions = [];
    for (let iLoop = 0; iLoop < localStorage.length; iLoop++){
      const current = localStorage.getItem(localStorage.key(iLoop)) || {};
      if (current.question) {
        finishedQuestions.push(current.question);
      }
    }
    if (finishedQuestions.length === questions.length) {
      finishedQuestions.clear();
    }
    const questionBucket = questions.filter(e => !finishedQuestions.includes(e));

    const key = (new Intl.DateTimeFormat().format(new Date())).replace(/\//g, "");
    const day = localStorage.getItem(key);
    if (!day) {
      localStorage.setItem(key, JSON.stringify({
        question: questionBucket[Math.floor(Math.random() * questionBucket.length)],
        members: [],
      }));
    }

    dialogService.openDialog(extensionInfo.publisherId + "." + extensionInfo.extensionId + ".popupDialog", options, { properties });
}
