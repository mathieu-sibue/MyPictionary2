const Word = require("../../models/Word");


async function addWord(req, res) {
    const { author, word, description } = req.body
    if (!author || !word || !description) {
        //Le cas où un des champs relatifs à l'ajout du mot ne serait pas rempli
        return res.status(400).json({
          text: "Requête invalide : manque des champs à remplir"
        });
    }
    try {
        await Word.create({
            word: word,
            description: description, 
            author: author,
            createdAt: new Date(),
        });
        return res.status(201).json({ text: `Succès : mot ${word} ajouté` })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })         
    }
}


async function getWords(req, res) {
    try {
        const wordList = await Word.find({});
        return res.status(200).json({ text: "Succès", wordList })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}

//fonction dépréciée
/*
async function modifyWord(req, res) {
    const { id, word, description } = req.body;
    try {
        await Word.findOneAndUpdate({ _id: id }, {$set:
            {
                word: word,
                description: description
            }
        });
        return res.status(200).json({ text: `Succès : mot ${word} modifié` }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })        
    }
}
*/

async function modifyWordAndFetchOthers(req, res) {
    const { id, word, description } = req.body;
    try {
        await Word.findOneAndUpdate({ _id: id }, {$set:
            {
                word: word,
                description: description
            }
        });
        const updatedWordList = await Word.find();
        return res.status(200).json({ text: `Succès : mot ${word} ajouté`, words: updatedWordList }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })        
    }
}

//fonction dépréciée
/*
async function deleteWord(req, res) {
    const { wordId } = req.body;
    try {
        await Word.deleteOne({ _id: wordId });
        return res.status(200).json({ text: `Succès : mot supprimé` }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })        
    }
}
*/

async function deleteWordAndFetchOthers(req, res) {
    const { wordId } = req.body;
    try {
        await Word.deleteOne({ _id: wordId });
        const updatedWordList = await Word.find();
        return res.status(200).json({ text: `Succès : mot supprimé`, words: updatedWordList }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })        
    }
}



exports.addWord = addWord;
exports.getWords = getWords;
//exports.modifyWord = modifyWord;
//exports.deleteWord = deleteWord;
exports.deleteWordAndFetchOthers = deleteWordAndFetchOthers;
exports.modifyWordAndFetchOthers = modifyWordAndFetchOthers;