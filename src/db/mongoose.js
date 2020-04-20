const chalk = require('chalk')
const mongoose = require('mongoose')
let connected = false

const dbService = {

    url() {
        return 'mongodb://127.0.0.1:27017/task-manager'
    },
    connect() {

        if (!connected) {

            console.log(chalk.blue('Connecting to DB'))

            mongoose.connect(this.url(), {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify : false
            })

        }

        connected = true;
    },
    async findAll(model) {
        return await model.find({});
    }, 
    async findById(model, id) {
        return await model.findById(id);
    },
    async save(model) {
        return await model.save();
    }, 
    async deleteById (model, id) {
        return await model.findByIdAndDelete(id, {})
    },
    async delete (model) {
        return await model.deleteOne({})
    }, 
    async count(model, filter) {
        return await model.CountDocuments(filter);
    },
    async deleteAndCount (model, id, filter) {
        const deletedModel = await model.findByIdAndDelete(id, {})
        const count = await model.countDocuments(filter);

        const dto = {
            model: deletedModel,
            count
        }

        return dto;
    },
    // async update(model, id, body) {
    //     // this method does not apply pre/post hooks hence use findAndUpdate 
    //     // for user models 
    //     return await model.findByIdAndUpdate(id, body, {new: true, runValidators: true, useFindAndModify: true})
    // },
    async update(model, body, updateKeys) {
        updateKeys.forEach((update) => model[update] = body[update])
        return await model.save()
    }, 
    async findAndUpdate(model, id, body, updateKeys) {
        const foundModel = await model.findById(id);

        if (foundModel) {
            updateKeys.forEach((update) => foundModel[update] = body[update])
            return await foundModel.save()
        } else {
            return undefined
        }        
    }

}

module.exports = dbService