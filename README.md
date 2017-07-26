React Native application for viewing AWS Cloudwatch logs. Built for iOS only
at this point.

# Developing

`cmd + <` in Xcode to set build configuration to debug.

In `AppDelegate.m` uncomment this line:

```
jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
```

In `AppDelegate.m` comment this line:

```
jsCodeLocation = [[NSBundle mainBundle] URLForResource: @"main" withExtension: @"jsbundle"];
```

`react-native run-ios` to run.

# Archiving

`cmd + <` in Xcode to set build configuration to release.

Build with `npm run build`.

In `AppDelegate.m` uncomment this line:

```
jsCodeLocation = [[NSBundle mainBundle] URLForResource: @"main" withExtension: @"jsbundle"];
```

In `AppDelegate.m` comment this line:

```
jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
```
