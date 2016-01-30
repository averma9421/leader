
Players = new Meteor.Collection("players"); // MongoDB collection named "players"
Members = new Meteor.Collection("members"); //MongoDB collection named "members"

if (Meteor.isClient) {
  Session.set('sort_choice', 'score');

  
 Meteor.subscribe('theMembers');


  // Set template variables
  Template.order.sort_by_name = function(){
    return Session.equals('sort_choice', 'name');
  };

  Template.order.sort_by_score = function(){
    return Session.equals('sort_choice', 'score');
  };
  // db query returns all of the players
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  
  // add new players
  Template.addPlayerForm.events({ 
    
	   'submit form': function(event){
    event.preventDefault();
    var playerNameVar = event.target.playerName.value;
     Meteor.call('insertPlayerData', playerNameVar);
	  
	  
    }
  });
  
  // db query returns all of the members
  
  Template.leaderboard.members = function(){
    var order = Session.equals('sort_choice', 'score') ? {score: -1, name: 1} : {name: 1, score: -1};
    return Members.find({}, {sort: order});
  };

  // set {{selected_name}} to value of session variable
  Template.leaderboard.selected_name = function () {
    var member = Members.findOne(Session.get("selected_player"));
    return member && member.name;
  };


  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  // event handler 
  Template.leaderboard.events({
    // $inc is Mongo modifier for incrementing scores property
	 // increment scores property by 5
	  
  'click .increment': function(){
	  
    var selectedPlayer = Session.get("selected_player");
	Meteor.call('modifyPlayerScore', selectedPlayer, 5);
},



//decrement score by 5
   'click .decrement': function(){
	    var selectedPlayer = Session.get("selected_player");
	   
      var member = Members.findOne(Session.get("selected_player"));
      var score = member.score;
      console.log("Score", score);
      if(score && score >= 5)
        Meteor.call('modifyPlayerScore',selectedPlayer, -5);
      else
         Meteor.call('modifyPlayerScore',selectedPlayer, 0);
    }
	   
	   
	   


  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });

  Template.order.events({
    'click .name': function(){
      Session.set('sort_choice', 'name');
    },

    'click .score': function(){
      Session.set('sort_choice', 'score');
    }
  });

  Template.reset.events({
    'click .score_reset': function(){
      Meteor.call('resetScores', 0);

    }
  });

 



}





// On server startup, create some members if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {

   if (Members.find().count() === 0){
      Members.insert({
	name: "Sugandha",
	score: 0
});

  Members.insert({
	name: "Shreesh",
	score: 0
});

  Members.insert({
	name: "Anshu",
	score: 0
});
    }
  
  
  


 Meteor.publish('theMembers', function(){
    return Members.find()
});



Meteor.methods({
  resetScores: function (score) {
    // set the score property on the document to score var
    Members.update({}, 
      {$set: {score: score}},
      {multi:true});
  },
  
  modifyPlayerScore: function(selectedPlayer,scoreValue){
    Members.update(selectedPlayer, {$inc: {score:scoreValue} });
	
	
},




    insertPlayerData: function(playerNameVar){
        
        Members.insert({
            name: playerNameVar,
            score: 0,
            
        });
    }

 
});
});





}

