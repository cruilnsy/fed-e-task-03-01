import { init, h } from 'snabbdom'

import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'
import clazz from 'snabbdom/modules/class'
import props from 'snabbdom/modules/props'

// global variables
let patch = init([
  style,
  eventlisteners,
  clazz,
  props
])
let originalData = [
  {rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', elmHeight: 0},
  {rank: 2, title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', elmHeight: 0},
  {rank: 3, title: 'The Godfather: Part II', desc: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.', elmHeight: 0},
  {rank: 4, title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.', elmHeight: 0},
  {rank: 5, title: 'Pulp Fiction', desc: 'The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', elmHeight: 0},
  {rank: 6, title: 'Schindler\'s List', desc: 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', elmHeight: 0},
  {rank: 7, title: '12 Angry Men', desc: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.', elmHeight: 0},
  {rank: 8, title: 'The Good, the Bad and the Ugly', desc: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.', elmHeight: 0},
  {rank: 9, title: 'The Lord of the Rings: The Return of the King', desc: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', elmHeight: 0},
  {rank: 10, title: 'Fight Club', desc: 'An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...', elmHeight: 0},
]
let data = [
  originalData[0],
  originalData[1],
  originalData[2],
  originalData[3],
  originalData[4],
  originalData[5],
  originalData[6],
  originalData[7],
  originalData[8],
  originalData[9],
]
let vnode
let sortBy = 'rank';
let nextKey = 11;

function view (data) {
  return h('div#app', [
    h('h1', 'Top 10 movies'),
    h('div', [
      h('a.btn.add', {on: {click: addMovie}},'Add'),
      'Sort by: ',
      h('span.btn-group', [
        h('a.btn.rank', {class: {active: sortBy === 'rank'}, on: {click: [changeSort, 'rank']}},'Rank'),
        h('a.btn.title', {class: {active: sortBy === 'title'}, on: {click: [changeSort, 'title']}}, 'Title'),
        h('a.btn.desc', {class: {active: sortBy === 'desc'}, on: {click: [changeSort, 'desc']}},'Description')
      ])
    ]),
    h('div.list', data.map(viewMovie))
  ])
}

function viewMovie (item) {
  return h('div.row',[
    h('div', {style: {fontWeight: 'bold'}}, item.rank),
    h('div', item.title),
    h('div', item.desc),
    h('div.btn.rm-btn', {on: {click: [removeMovie, item]}}, 'x')
  ])
}

function changeSort(type) {
  sortBy = type
  data.sort((a, b) => {
    if (a[type] > b[type]) {
      return 1
    }
    if (a[type] < b[type]) {
      return -1
    }
    return 0
  })
  render()
}

function addMovie () {
  let temp = originalData[Math.floor(Math.random() * 10)]
  data.push({rank: nextKey++, title: temp.title, desc: temp.desc})
  render()
}

function removeMovie (item) {
  data = data.filter(m => m !== item)
  render()
}

function render () {
  vnode = patch(vnode, view(data))
}

window.addEventListener('DOMContentLoaded', () => {
  let app = document.getElementById('app');
  vnode = patch(app, view(data))
});