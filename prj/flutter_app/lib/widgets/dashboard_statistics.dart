
import 'package:flutter/material.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class MentorSessionStats extends StatelessWidget {
  final List<charts.Series<LinearSessions,String>> seriesList;
  final bool animate;

  MentorSessionStats(this.seriesList, {this.animate = false});

  factory MentorSessionStats.withSampleData() {
    return MentorSessionStats(
      _createSampleData(),
      animate: false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return charts.PieChart<String>(
      seriesList,
      animate: animate,
      
      behaviors: [
        
        charts.DatumLegend(
        
          position: charts.BehaviorPosition.end,
          horizontalFirst: false,
          cellPadding: const EdgeInsets.only(right: 50.0, bottom: 10.0),
          showMeasures: true,
          legendDefaultMeasure: charts.LegendDefaultMeasure.firstValue,
          
          
        ),
      ],
    );
  }

  // Placeholder data
  static List<charts.Series<LinearSessions, String>> _createSampleData() {
    final data = [
      LinearSessions("Completed", 50, charts.MaterialPalette.green.shadeDefault),
      LinearSessions("Upcoming", 30, charts.MaterialPalette.blue.shadeDefault),
      LinearSessions("Pending", 15, charts.MaterialPalette.deepOrange.shadeDefault),
      LinearSessions("Canceled", 10, charts.MaterialPalette.red.shadeDefault),
    ];

    return [
      charts.Series<LinearSessions, String>(
        id: 'Sessions',
        domainFn: (LinearSessions sess, _) => sess.sessionType,
        measureFn: (LinearSessions sess, _) => sess.numSessions,
        colorFn: (LinearSessions sess, _) => sess.color,
        data: data,
      )
    ];
  }
}

/// Sample linear data type.
class LinearSessions {
  final String sessionType;
  final int numSessions;
  final charts.Color color;

  LinearSessions(this.sessionType, this.numSessions, this.color);
}