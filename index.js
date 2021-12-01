'use strict';

const path = require('path');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

// @TODO: we're going to pull this in ...
const stew = require('broccoli-stew');
const debug = stew.debug;
const find = stew.find;
const mv = stew.mv;
// const rm = stew.rm;
// const map = stew.map;
// const rename = stew.rename;
// const BroccoliDebug = require('broccoli-debug');

const defaultOptions = {
  theme: 'blue'
}

module.exports = {
  name: 'ember-themed-components',

  included() {
    this._super.included.apply(this, arguments);

    // TODO: we're using private api here (ember-cli 2.7+)
    let app = this._findHost.call(this);

    let options = Object.assign({}, defaultOptions, app.options['ember-themed-components']);
    this.themedOptions = options;
  },

  // HELPS to have the right hook that you're working with here!
  // background on behavior here: if any *.css files exist in the tree sent back
  // they get concatenated and merged into the vendor.css file
  // we take advantage of that ...
  // @TODO: turns out this isn't documented at all?
  treeForAddonStyles: function treeForAddonStyles(tree) {
    const styleTrees = [];

    const themeTree = new Funnel(path.join('addon', 'themes'), {
      annotation: 'ember-themed-components',
      include: [`${this.themedOptions.theme}.css`],
    });

    styleTrees.push(themeTree);

    if (tree) {
      styleTrees.push(tree);
    }

    // return debug(new MergeTrees(styleTrees, { overwrite: true }), 'final_tree');
    return new MergeTrees(styleTrees, { overwrite: true });

    // DEBUG=broccoli-funnel:ember-themed-* ember s
    // DEBUG=broccoli-stew* DEBUG=broccoli-merge-trees:* ember s
  },
  // treeForAddonStyles: function treeForAddonStyles(tree) {
  //   const styleTrees = [];

  //   const themePath = path.join('addon', 'themes');

  //   // const initialTree = debug(find(themePath, `${this.themedOptions.theme}.css`), 'initial_tree');
  //   const initialTree = find(themePath, `${this.themedOptions.theme}.css`);

  //   const movedTree = mv(initialTree, path.join(themePath, '*.css'), 'ember-themed-component.css');
  //   // styleTrees.push(debug(movedTree, 'moved_tree'));
  //   styleTrees.push(movedTree, 'moved_tree');

  //   if (tree) {
  //     styleTrees.push(tree);
  //   }

  //   // return debug(new MergeTrees(styleTrees, { overwrite: true }), 'final_tree');
  //   return new MergeTrees(styleTrees, { overwrite: true });

  //   // DEBUG=broccoli-stew* DEBUG=broccoli-merge-trees:* ember s
  // },
};
