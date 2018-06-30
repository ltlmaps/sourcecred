// @flow
import type {
  PluginAdapter as IPluginAdapter,
  Renderer as IRenderer,
} from "../../app/pluginAdapter";
import {type Graph, NodeAddress} from "../../core/graph";
import {createGraph} from "./createGraph";
import * as N from "./nodes";
import {RelationalView} from "./relationalView";
import {description} from "./render";

export async function createPluginAdapter(
  repoOwner: string,
  repoName: string
): Promise<IPluginAdapter> {
  const url = `/api/v1/data/data/${repoOwner}/${repoName}/github/view.json`;
  const response = await fetch(url);
  if (!response.ok) {
    return Promise.reject(response);
  }
  const json = await response.json();
  const view = RelationalView.fromJSON(json);
  const graph = createGraph(view);
  return new PluginAdapter(view, graph);
}

class PluginAdapter implements IPluginAdapter {
  +_view: RelationalView;
  +_graph: Graph;
  constructor(view: RelationalView, graph: Graph) {
    this._view = view;
    this._graph = graph;
  }
  name() {
    return "GitHub";
  }
  graph() {
    return this._graph;
  }
  renderer() {
    return new Renderer(this._view);
  }
  nodePrefix() {
    return N._Prefix.base;
  }
}

class Renderer implements IRenderer {
  +_view: RelationalView;
  constructor(view) {
    this._view = view;
  }
  nodeDescription(node) {
    // This cast is unsound, and might throw at runtime, but won't have
    // silent failures or cause problems down the road.
    const address = N.fromRaw((node: any));
    const entity = this._view.entity(address);
    if (entity == null) {
      throw new Error(`unknown entity: ${NodeAddress.toString(node)}`);
    }
    return description(entity);
  }
}