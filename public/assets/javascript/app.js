var questionsArr = [] 

$(document).on("click", ".button", function(){
	checkFields();
});

function checkFields() {
	var name = $("#name").val()
	var photo = $("#photo").val()
	var none = []
	if (photo == "" || name == "") {
		alert("Please makes sure to include your name and a link to a photo")
	}
	for (var i = 0; i < questionsArr.length; i++) {
		if ($("#sel"+questionsArr[i]).val() == ""){
			none.push(questionsArr[i])
		}
	}
	if (none.length > 0) {
		alert("You're missing fields")
	} else insertInfo();
}

function insertInfo() {
	var name = $("#name").val()
	var photo = $("#photo").val()
	$.ajax({
		url: '/insert',
		method: 'POST',
		data: {name : name, photo : photo}
	}).then(function(message){
		insertAnswers(message.id)
	});
}

function insertAnswers(id,cb) {
	for (var i = 0; i < questionsArr.length; i++) {
		var score = $("#sel"+questionsArr[i]).val()
		var qid = questionsArr[i]
		$.ajax({
			url: '/insert/' + id,
			method: 'POST',
			data: {question_id : qid, score : score},
			async: false
		}).done(function(){
			location.href = "/match.html"
		});
	}
	cb(id)
	clear()
}

function clear() {
	questionsArr = []
	$("#name").val("")
	$("#photo").val("")
	appendQuestions()
}

function appendQuestions() {
	$("#questions").empty()
	var selections = ["Hell Nah!","Nah...","Whatever","Yeah...","Hell Yeah!"]
	$.ajax({
		url: '/question',
		method: 'GET'
	}).then(function(res){
		for (var i = 0; i < res.length; i++) {
			if (questionsArr.indexOf(res[i].id) == -1 )
				questionsArr.push(res[i].id)
			var h = $("<h3>")
			h.text("Question "+(i+1)+":")
			var p = $("<span>")
			p.append(res[i].question)
			p.attr("id","question"+res[i].id)
			var div = $("<div>")
			var sel = $("<select>")
			sel.attr("id","sel"+res[i].id)
			var op = $("<option>")
			op.text("Select An Option")
			op.attr("value","")
			sel.append(op)
			for (var n = 0; n < selections.length; n++) {
				var option = $("<option>")
				option.text(selections[n])
				option.attr("value",parseInt(n+1))
				sel.append(option)
			}
			div.append(sel)
			var br = $("<br>")
			$("#questions").append(h)
			$("#questions").append(p)
			$("#questions").append(div)
			$("#questions").append(br)
		}
		var b = $("<button>")
		b.attr("class","button")
		b.attr("type","button")
		b.text("Submit")
		b.attr("id","submit")
		$("#questions").append(b)
	});
}

function appendFriends(){
	$.ajax({
		url: '/friends',
		method: 'GET'
	}).then(function(res){
		$(".containerThree").append(`
			<div class="message">You matched with ${res[0].name}!</div>
			<div class="picMatch">Photo: <img src="${res[0].picture_link}"/></div>
			<div class="scoreMatch">Score: ${res[0].scores}</div>
		`)
	})
}