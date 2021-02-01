

(function() {

    const arccore = require("@encapsule/arccore");
    const holarchyCM = require("@encapsule/holarchy-cm");

    const routerEventDescriptorSpec = require("../lib/iospecs/router-event-descriptor-spec");

    const routerEventDescriptor_ObservableValueCMID = arccore.identifier.irut.fromReference("HolisticHTML5Service_DOMLocation.ObservableValue.CellModel.routerEventDescriptor").result;
    const routerEventDescriptor_ObservableValueAPMID = arccore.identifier.irut.fromReference("HolisticHTML5Service_DOMLocation.ObservableValue.AbstractProcessModel.routerEventDescriptor").result;

    let factoryResponse = holarchyCM.factories.makeObservableValueCellModel.request({
        cellID: routerEventDescriptor_ObservableValueCMID,
        apmID: routerEventDescriptor_ObservableValueAPMID,
        valueTypeLabel: routerEventDescriptorSpec.____label,
        valueTypeDescription: routerEventDescriptorSpec.____description,
        valueTypeSpec: routerEventDescriptorSpec,
    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    const observableValueCellModel = factoryResponse.result;

    const routerEventDescriptor_ValueObserverCMID = arccore.identifier.irut.fromReference("HolisticHTML5Service_DOMLocation.ValueObserver.CellModel.routerEventDescriptor").result;
    const routerEventDescriptor_ValueObserverAPMID = arccore.identifier.irut.fromReference("HolisticHTML5Service_DOMLocation.ValueObserver.AbstractProcessModel.routerEventDescriptor").result;

    factoryResponse = holarchyCM.factories.makeValueObserverCellModel.request({
        cellID: routerEventDescriptor_ValueObserverCMID,
        apmID: routerEventDescriptor_ValueObserverAPMID,
        valueTypeLabel: routerEventDescriptorSpec.____label,
        valueTypeDescription: routerEventDescriptorSpec.____description,
        valueTypeSpec: routerEventDescriptorSpec,
    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    const valueObserverCellModel = factoryResponse.result;

    module.exports = {
        cellmodels: [
            observableValueCellModel,
            valueObserverCellModel
        ]
    };

})();

