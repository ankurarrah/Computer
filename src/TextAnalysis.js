const lib = require("./externalSummarization.js");

"use strict";

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

const key = 'c5c90481fbea4086be1592beddb97312';
const endpoint = `https://fhltextsummary.cognitiveservices.azure.com/`;

const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));
var articleOfText =  "In the US, the criminal justice system isn’t exactly fair."+
  "In an ideal system, if you break the law, your punishment should be determined by the severity of the crime. But in our system, it’s skewed by all kinds of other factors. For instance, people of color receive much harsher sentencing than white people. Class plays a huge role as well — wealth can buy you the best lawyers and freedom from punishment"+
  "And another privilege that can make you immune from consequences is celebrity status."+
  "Below are five famous people whose actions killed people, intentionally or not. And thanks to their privilege and wealth, they all got away with it — without facing the consequences the average person would face."+
  "Matthew Broderick"+
  "In 1987, Broderick visited Ireland with his girlfriend at the time, Jennifer Grey. While driving along the road during their vacation, Broderick swerved onto the wrong side of the road, resulting in a severe head-on collision with a Volvo. Broderick and Grey both survived, but the two people in the Volvo — the driver and her mother — passed away almost immediately."+
  "Broderick was charged with causing “death by dangerous driving,” an offense punishable by up to 10 years in prison."+
  "So how much time did he end up serving? None. Because of his massive wealth and fame, he managed to have his charge reduced to “careless driving,” a charge usually reserved for much more innocuous transgressions. And rather than serving any time in prison, he paid a measly $175 fine."+
  "Headlines about the incident read “Matthew Broderick Injured in Car Crash,” not even acknowledging the two women who tragically died."+
  "Caitlyn Jenner"+
  "In February of 2015, Jenner was driving her Cadillac Escalade on the Pacific Coast Highway in Malibu as she would on any other day. But today, she was driving rather recklessly."+
  "As she was approaching a traffic light, she realized she was driving at an unsafe speed, so she veered into another lane and rear-ended a Lexus and a Prius sitting at the red light. The Lexus was then propelled into oncoming traffic and struck by a Hummer. Tragically, the woman in the Lexus, 69-year-old actress Kim Howe, died immediately."+
  "Investigators confirmed that Jenner was at fault for the crash. Nonetheless, Jenner and her attorney accused the woman in the Prius of causing the accident by being “inattentive.”"+
  "Even though most cases like this would result in criminal consequences, Jenner was cleared of any charges. And even though vehicular manslaughter is often charged as a felony, Jenner wasn’t even charged with a misdemeanor.";

async function keyPhraseExtraction(client){

    const keyPhrasesInput = [articleOfText];
    const keyPhraseResult = await client.extractKeyPhrases(keyPhrasesInput);
    
    keyPhraseResult.forEach(document => {
        console.log(`ID: ${document.id}`);
        console.log(`\tDocument Key Phrases: ${document.keyPhrases}`);
    });
}
keyPhraseExtraction(textAnalyticsClient);
var textRank = new TextRank(articleOfText);
console.log(textRank.summarizedArticle);

