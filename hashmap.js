// @ts-check

class HashMap {
  length = 0;
  #loadFactor = 0.75;
  #capacity = 16;
  #map = /** @type {(HashNode | null)[]} */ (
    new Array(this.#capacity).fill(null)
  );

  /** @param {string} key */
  #hash(key) {
    const PRIME = 31;
    let hash = 0;

    for (let i = 0; i < key.length; i++) {
      hash = PRIME * hash + key.charCodeAt(i);
    }

    return hash % this.#capacity;
  }

  #resize() {
    if (this.length / this.#capacity > this.#loadFactor) {
      /** @type {{ key: string, value: any }[]} */
      const nodes = [];

      this.#map.forEach((node) => {
        let _node = node;

        while (_node) {
          nodes.push({ key: _node.key, value: _node.value });
          _node = _node.next;
        }
      });

      this.length = 0;
      this.#capacity *= 2;
      this.#map = new Array(this.#capacity).fill(null);
      nodes.forEach((node) => this.set(node.key, node.value));
    }
  }

  /** @param {string} key */
  #getNode(key) {
    const hash = this.#hash(key);
    let parent = null;
    let node = this.#map[hash];

    while (node && node.key !== key) {
      parent = node;
      node = node.next;
    }

    return { node, parent };
  }

  /** @param {string} key */
  get(key) {
    const { node } = this.#getNode(key);

    if (!node) return null;
    return node.value;
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    this.#resize();

    const { node, parent } = this.#getNode(key);

    if (node) {
      node.value = value;
      return;
    }

    if (parent) {
      parent.next = new HashNode(key, value);
    } else {
      const hash = this.#hash(key);
      this.#map[hash] = new HashNode(key, value);
    }

    this.length++;
  }

  /** @param {string} key */
  has(key) {
    const node = this.#getNode(key);
    return !!node;
  }

  /** @param {string} key */
  remove(key) {
    const { node, parent } = this.#getNode(key);

    if (!node) return;

    if (parent) {
      parent.next = null;
    } else {
      const hash = this.#hash(key);
      this.#map[hash] = null;
    }

    this.length--;
  }

  entries() {
    /** @type {{ key: string, value: any }[]} */
    const nodes = [];

    this.#map.forEach((node) => {
      let _node = node;

      while (_node) {
        nodes.push({ key: _node.key, value: _node.value });
        _node = _node.next;
      }
    });

    return nodes;
  }

  keys() {
    const entries = this.entries();
    return entries.map((entry) => entry.key);
  }

  values() {
    const entries = this.entries();
    return entries.map((entry) => entry.value);
  }

  clear() {
    this.length = 0;
    this.#capacity = 16;
    this.#map = new Array(this.#capacity).fill(null);
  }
}

class HashNode {
  /**
   * @param {string} key
   * @param {*} value
   */
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = /** @type {HashNode | null} */ (null);
  }
}
