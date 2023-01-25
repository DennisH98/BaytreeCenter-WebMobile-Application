import 'package:flutter/material.dart';
import 'package:flutter/material.dart' as flutter show IconButton;

class IconButton extends StatefulWidget {
  IconButton(
      {Key? key,
      required this.icon,
      this.label,
      this.labelTextStyle = const TextStyle(fontSize: 28.0),
      this.padding = const EdgeInsets.all(8.0),
      this.iconSize = 34.0,
      this.tooltip,
      Color? color,
      this.onPressed})
      : color = Colors.grey[300]!,
        borderRadius = BorderRadius.circular(8),
        super(key: key) {
    this.color = color ?? Colors.grey[300]!;
  }

  @override
  _IconButtonState createState() => _IconButtonState();

  Icon icon;
  String? label;
  TextStyle labelTextStyle;
  EdgeInsets padding;
  double iconSize;
  String? tooltip;
  BorderRadius borderRadius;
  Color color;
  Function? onPressed;
}

class _IconButtonState extends State<IconButton> {
  @override
  Widget build(BuildContext context) {
    return Container(
        padding: widget.padding,
        decoration: BoxDecoration(
          color: widget.color,
          borderRadius: widget.borderRadius,
        ),
        child: Column(children: <Widget>[
          flutter.IconButton(
            icon: widget.icon,
            iconSize: widget.iconSize,
            tooltip: widget.tooltip,
            onPressed: () {
              if (widget.onPressed != null) {
                widget.onPressed!(context);
              }
            },
          ),
          if (widget.label != null)
            Text(widget.label!, style: widget.labelTextStyle)
        ]));
  }
}
