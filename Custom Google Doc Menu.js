function createAndSendDocument() {
  try {
    ScriptApp.newTrigger('customMenu')
    .forDocument(DocumentApp.openById('docID')) // .forDocument(DocumentApp.getActiveDocument())
    .onOpen()
    .create();
  } catch (err) {
    console.log('Failed with error %s', err.message);
  }
}

function customMenu(){
    var ui = DocumentApp.getUi();
    ui.createMenu('Formats')
      .addItem('Format phone number', 'phoneNumber')
      .addToUi();
}

function phoneNumber() {
  const doc = DocumentApp.getActiveDocument();

  const selection = doc.getSelection();
  const elements = selection.getRangeElements();
  
  elements.forEach(element => {
    const text = element.getElement().asText();
    const selectedText = text.getText().substring(element.getStartOffset(), element.getEndOffsetInclusive()+1);

    text.deleteText(element.getStartOffset(), element.getEndOffsetInclusive());
    text.insertText(element.getStartOffset(), formatPhoneNumber(selectedText))
    
  });
}

function formatPhoneNumber(number) {
				// default prefix
    if (number.length == 6) return "2302-" + number;

    if (number.length < 10) return null;

    const regex = new RegExp(/^\s*(\+)?(54)?\s*(9)?\s*(\()?(0)?(\d{4})?(\))?([- ]*)(15)?(\d{6})?\s*$/);
    const temp = regex.exec(number);
    
    try {
        return temp[6] + "-" + temp[10];
    } catch (error) {
        return null;
    }
}