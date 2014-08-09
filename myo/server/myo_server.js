points = new Meteor.Collection('pointsCollection');
colors = new Meteor.Collection('pointsColors');
brushSizes = new Meteor.Collection('brishSizes');
clickDrags = new Meteor.Collection('clickDrags');

Meteor.publish('pointsSubscription', function () {
  return points.find();
});

Meteor.publish('colorsSubscription', function () {
  return colors.find();
});

Meteor.publish('sizesSubscription', function () {
  return colors.find();
});

Meteor.publish('clickDragsSubscription', function () {
  return clickDrags.find();
});

var convasWidth = 960;
var canvasHeight = 960;

Meteor.methods({
  'clear': function () {
    points.remove({});
    colors.remove({});
    brushSizes.remove({});
    clickDrags.remove({});
  }
});

HTTP.methods({
  '/myo/:id/event': function(data) {
    var id = req.params.id;
    var eventType = data.eventType;
    var event = {
      myoId: id,
      eventType: eventType,
      timestamp: data.timestamp
    };

    switch (eventType) {
    case 'onPair':
    case 'onConnect':
      event = {
        firmwareVersion: {
          firmwareVersionMajor: data['firmwareVersion.firmwareVersionMajor'],
          firmwareVersionMinor: data['firmwareVersion.firmwareVersionMinor'],
          firmwareVersionPatch: data['firmwareVersion.firmwareVersionPatch'],
          firmwareVersionHardwareRev: data['firmwareVersion.firmwareVersionHardwareRev'],
        }
      };
      handlePairEvent(event);
      break;
    case 'onDisconnect':
    case 'onArmLost':
      handleArmLostEvent(event);
      break;
    case 'onArmRecognized':
      event = {
        arm: data.arm,
        xDirection: data.xDirection
      };
      handleArmEvent(event);
    case 'onPose':
      handlePoseEvent(data.pose);
      break;
    case 'onOrientationData':
      event = {
        rotation: {
          x: data['rotation.x'],
          y: data['rotation.y'],
          z: data['rotation.z'],
          w: data['rotation.w']
        }
      };
      handleRotationEvent(event);
      break;
    case 'onAccelerometerData':
      event = {
        accel: {
          x: data['accel.x'],
          y: data['accel.y'],
          z: data['accel.z'],
        }
      };
      handleAccelEvent(event);
      break;
    case 'onGyroscopeData':
      event =  {
        gyro: {
          x: data['gyro.x'],
          y: data['gyro.y'],
          z: data['gyro.z'],
        }
      };
      handleGyroEvent(event);
      break;
    case 'onRssi':
      event =  {
        rssi: data.rssi
      };
      handleRssiEvent(event);
      break;
    default:
      console.log('Default case');
    }
    console.log('%j', event);
  }
});

function handlePoseEvent(pose) {
  switch (pose) {
    default:
      console.log('handlePose ' + pose);
  }
}

function handlePairEvent(pose) {
}


function handleRotationEvent(pose) {
}

function handleGyroEvent(pose) {
}

function handleAccelEvent(pose) {
}

function handleArmEvent(pose) {
}

function handlePairEvent(pose) {
}
