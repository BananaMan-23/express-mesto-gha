const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const {
  CastError,
  DocumentNotFoundError,
  ServerError,
} = require('../utils/constants');

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user})
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(CastError).send({ message: err.message });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// module.exports.getCards = (req, res) => {
//   Card.find({})
//     .populate(['owner', 'likes'])
//     .then((cards) => res.send(cards))
//     .catch(() => res.status(ServerError).send({ message: 'На сервере произошла ошибка' }));
// };
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(CastError).send({ message: 'Некорректный ID карточки.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(DocumentNotFoundError).send({ message: 'Карточка с указанным ID не найдена.' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка.' });
      }
    });
};

// module.exports.likeCard = (req, res) => {
//   Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
//     .populate(['owner', 'likes'])
//     .orFail()
//     .then((card) => {
//       res.send(card);
//     })
//     .catch((err) => {
//       if (err instanceof mongoose.Error.CastError) {
//         res.status(CastError).send({ message: 'Некорректный ID карточки.' });
//       } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
//         res.status(DocumentNotFoundError).send({ message: 'Карточка с указанным ID не найдена.' });
//       } else {
//         res.status(ServerError).send({ message: 'Произошла ошибка.' });
//       }
//     });
// };
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new DocumentNotFoundError('Карточка с таким ID не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

// module.exports.dislikeCard = (req, res) => {
//   Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
//     .populate(['owner', 'likes'])
//     .orFail()
//     .then((card) => {
//       res.send(card);
//     })
//     .catch((err) => {
//       if (err instanceof mongoose.Error.CastError) {
//         res.status(CastError).send({ message: 'Некорректный ID карточки.' });
//       } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
//         res.status(DocumentNotFoundError).send({ message: 'Карточка с указанным ID не найдена.' });
//       } else {
//         res.status(ServerError).send({ message: 'Произошла ошибка.' });
//       }
//     });
// };
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new DocumentNotFoundError('Карточка с таким ID не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};
