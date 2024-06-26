import { Status } from 'types/IstioStatus';
import {
  DecoratedMeshEdgeData,
  DecoratedMeshEdgeWrapper,
  DecoratedMeshElements,
  DecoratedMeshNodeData,
  DecoratedMeshNodeWrapper,
  MeshEdgeWrapper,
  MeshElements,
  MeshNodeWrapper
} from '../../types/Mesh';
import { DEGRADED, FAILURE, HEALTHY } from 'types/Health';

// When updating the mesh, the element data expects to have all the changes
// non-provided values are taken as "this didn't change", similar as setState does.
// Put default values for all fields that are omitted.
export const decorateMeshData = (meshData: MeshElements): DecoratedMeshElements => {
  const elementsDefaults = {
    edges: {
      isMTLS: -1
    },
    nodes: {
      healthData: undefined,
      health: undefined,
      isBox: undefined,
      isInaccessible: undefined,
      isIstio: undefined
    }
  };

  const decoratedMesh: DecoratedMeshElements = {};
  if (meshData) {
    if (meshData.nodes) {
      decoratedMesh.nodes = meshData.nodes.map((node: MeshNodeWrapper) => {
        const decoratedNode: any = { ...node };

        // Calculate health (except for Kiali instance)
        if (decoratedNode.data.healthData && decoratedNode.data.name !== 'kiali') {
          switch (decoratedNode.data.healthData) {
            case Status.Healthy:
              decoratedNode.data.healthStatus = HEALTHY.name;
              break;
            case Status.NotReady:
              decoratedNode.data.healthStatus = DEGRADED.name;
              break;
            default:
              decoratedNode.data.healthStatus = FAILURE.name;
          }
        }

        decoratedNode.data = { ...elementsDefaults.nodes, ...decoratedNode.data } as DecoratedMeshNodeData;
        return decoratedNode as DecoratedMeshNodeWrapper;
      });
    }
    if (meshData.edges) {
      decoratedMesh.edges = meshData.edges.map((edge: MeshEdgeWrapper) => {
        const decoratedEdge: any = { ...edge };

        // Edge has the same health status as the infra target node
        const targetNode = decoratedMesh.nodes?.find(node => node.data.id === edge.data.target);
        decoratedEdge.data.healthStatus = targetNode?.data.healthStatus;

        decoratedEdge.data = { ...elementsDefaults.edges, ...decoratedEdge.data } as DecoratedMeshEdgeData;
        return decoratedEdge as DecoratedMeshEdgeWrapper;
      });
    }
  }
  return decoratedMesh;
};
