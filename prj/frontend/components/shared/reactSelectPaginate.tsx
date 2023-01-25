import { useTheme } from "@chakra-ui/system";
import React, { useEffect, useRef, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

const ReactSelectPaginate: React.FC<
  React.ComponentProps<typeof AsyncPaginate>
> = (props) => {
  const theme = useTheme();

  const prevReactSelectPaginateIdNumberRef = useRef(0);
  prevReactSelectPaginateIdNumberRef.current++;

  const [options, setOptions] = useState<any[]>([]);

  const [key, setKey] = useState<any>(
    "key" + prevReactSelectPaginateIdNumberRef
  );

  useEffect(() => {
    const func = async () => {
      const { options } = (await props.loadOptions("", {
        length: 0,
      } as any)) as any;
      setOptions(options);
      setKey(key + "spongebob");
    };
    func();
  }, []);

  return (
    <AsyncPaginate
      key={key}
      debounceTimeout={700}
      options={options}
      id={`select_paginate_${prevReactSelectPaginateIdNumberRef.current}`}
      instanceId={`select_paginate_instanceid_${prevReactSelectPaginateIdNumberRef.current}`}
      styles={{
        container: (base) => ({
          ...base,
          width: "100%",
          maxWidth: "600px",
        }),
        control: (base) => ({
          ...base,
          ":focus-within": {
            borderColor: theme.colors.primary[500],
            color: theme.colors.primary[500],
            boxShadow: `0 0 3px 1.5px ${theme.colors.primary[500]}`,
          },
        }),
      }}
      {...props}
    />
  );
};

export default ReactSelectPaginate;
